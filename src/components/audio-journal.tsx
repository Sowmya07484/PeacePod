
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mic, Square, Save, Trash2, History } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedNotePlayer } from './saved-note-player';

type SavedNote = {
  url: string;
  date: Date;
}

export default function AudioJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);
  
  useEffect(() => {
    // Clean up audio object URLs when component unmounts
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      savedNotes.forEach(note => URL.revokeObjectURL(note.url));
    };
  }, [audioUrl, savedNotes]);

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        if(audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const newAudioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(newAudioUrl);
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setElapsedTime(0);
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast({
            variant: "destructive",
            title: "Microphone Error",
            description: "Could not access the microphone. Please check your browser permissions."
        })
      }
    } else {
        toast({
            variant: "destructive",
            title: "Not Supported",
            description: "Your browser does not support audio recording."
        })
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleSave = () => {
    if (audioUrl) {
      setSavedNotes(prev => [{ url: audioUrl, date: new Date() }, ...prev]);
      setAudioUrl(null); // Clear the current recording from player
      setElapsedTime(0);
      toast({
          title: "Recording Saved",
          description: "Your voice note has been added to your history."
      });
    }
  }

  const handleDelete = (index: number) => {
    const noteToDelete = savedNotes[index];
    URL.revokeObjectURL(noteToDelete.url);
    setSavedNotes(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Note Deleted",
      description: "The voice note has been removed.",
    });
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Voice Note</CardTitle>
        <CardDescription>Record your thoughts out loud.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
        <div className="text-4xl font-mono text-foreground tabular-nums">
          {formatTime(elapsedTime)}
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleToggleRecording} size="icon" className="h-16 w-16 rounded-full" variant={isRecording ? 'destructive' : 'default'}>
            {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
          </Button>
        </div>

        {audioUrl && !isRecording && (
            <div className="flex w-full flex-col items-center space-y-2 pt-4">
                <p className="text-sm font-medium">New Recording</p>
                <SavedNotePlayer audioUrl={audioUrl} />
            </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4">
        {audioUrl && !isRecording && (
          <Button onClick={handleSave} size="lg" className="w-full">
            <Save className="mr-2 h-5 w-5" />
            Save Recording
          </Button>
        )}
        
        {savedNotes.length > 0 && (
          <div className="w-full space-y-4 pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><History /> Saved Notes</h3>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                {savedNotes.map((note, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {note.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, {note.date.toLocaleTimeString()}
                      </p>
                       <SavedNotePlayer audioUrl={note.url} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete note</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
