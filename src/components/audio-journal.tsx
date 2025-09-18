
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mic, Square, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { SavedNotePlayer } from './saved-note-player';

type SavedNote = {
  url: string;
  date: Date;
}

interface AudioJournalProps {
  onSave: (note: SavedNote) => void;
}

export default function AudioJournal({ onSave }: AudioJournalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
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
    };
  }, [audioUrl]);

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
      onSave({ url: audioUrl, date: new Date() });
      setAudioUrl(null); // Clear the current recording from player
      setElapsedTime(0);
      toast({
          title: "Recording Saved",
          description: "Your voice note has been added to your history."
      });
    }
  }
  
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
      </CardFooter>
    </Card>
  );
}
