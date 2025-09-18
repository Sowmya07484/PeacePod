
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface SavedNotePlayerProps {
    audioUrl: string;
}

export function SavedNotePlayer({ audioUrl }: SavedNotePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Pause audio when audioUrl changes
    useEffect(() => {
        if(audioRef.current){
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [audioUrl]);

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
    
    return (
        <div className="flex w-full items-center gap-2">
            <Button onClick={handleTogglePlay} size="icon" variant="ghost">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            <audio 
                ref={audioRef} 
                src={audioUrl} 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full"
                controls
            />
        </div>
    );
}
