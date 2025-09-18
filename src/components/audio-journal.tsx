
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Save, Play, Pause } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function AudioJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    // Clean up audio object URL
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
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
    handleStopRecording();
    setElapsedTime(0);
    toast({
        title: "Recording Saved",
        description: "Your voice note has been saved. You can play it back now."
    })
  }
  
  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
          { !isRecording && elapsedTime > 0 &&
            <Button onClick={handleSave} size="icon" className="h-16 w-16 rounded-full" variant="outline">
              <Save className="h-6 w-6" />
              <span className="sr-only">Save Recording</span>
            </Button>
          }
        </div>
        {audioUrl && !isRecording && (
          <div className="flex flex-col items-center space-y-4 pt-4">
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full"
            />
            <Button onClick={handleTogglePlay} size="lg">
              {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isPlaying ? 'Pause' : 'Play Recording'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
