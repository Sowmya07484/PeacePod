"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Save } from "lucide-react";

export default function AudioJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setElapsedTime(0);
      setIsRecording(true);
    }
  };

  const handleSave = () => {
    setIsRecording(false);
    setElapsedTime(0);
    // Mock save action
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
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
      </CardContent>
    </Card>
  );
}
