"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Annoyed, Frown, Laugh, Meh, Smile } from "lucide-react";

type Mood = 'laugh' | 'smile' | 'meh' | 'frown' | 'annoyed';

const moodIcons: Record<Mood, React.ReactNode> = {
  laugh: <Laugh className="h-8 w-8" />,
  smile: <Smile className="h-8 w-8" />,
  meh: <Meh className="h-8 w-8" />,
  frown: <Frown className="h-8 w-8" />,
  annoyed: <Annoyed className="h-8 w-8" />,
};

interface MoodEntryProps {
  journalText: string;
  setJournalText: (text: string) => void;
  onSave: (mood: Mood, text: string) => void;
  initialMood: string;
}

export default function MoodEntry({ journalText, setJournalText, onSave, initialMood }: MoodEntryProps) {
  const [selectedMood, setSelectedMood] = useState<Mood>(initialMood as Mood || 'smile');

  const handleSave = () => {
    onSave(selectedMood, journalText);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Journal</CardTitle>
        <CardDescription>Select your mood and write a journal entry.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-2 sm:space-x-4 rounded-lg bg-secondary/50 p-4">
          {Object.keys(moodIcons).map((mood) => (
            <Button
              key={mood}
              variant={selectedMood === mood ? 'default' : 'ghost'}
              size="icon"
              className={`h-14 w-14 rounded-full transition-transform duration-200 hover:scale-110 ${selectedMood === mood ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              onClick={() => setSelectedMood(mood as Mood)}
              aria-label={`Select mood: ${mood}`}
            >
              {moodIcons[mood as Mood]}
            </Button>
          ))}
        </div>
        <Textarea
          placeholder="Start writing your thoughts here..."
          className="min-h-[200px] resize-none"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto">Save Entry</Button>
      </CardFooter>
    </Card>
  );
}
