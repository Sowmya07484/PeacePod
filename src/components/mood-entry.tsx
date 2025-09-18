
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Frown, Laugh, Meh, Smile, Angry, FilePlus2, Eraser } from "lucide-react";

type Mood = 'laugh' | 'smile' | 'meh' | 'frown' | 'sad';

const moodIcons: Record<Mood, React.ReactNode> = {
  laugh: <Laugh className="h-8 w-8 text-[hsl(var(--chart-3))]" />,
  smile: <Smile className="h-8 w-8 text-[hsl(var(--chart-4))]" />,
  meh: <Meh className="h-8 w-8 text-muted-foreground" />,
  frown: <Frown className="h-8 w-8 text-[hsl(var(--chart-1))]" />,
  sad: <Angry className="h-8 w-8 text-[hsl(var(--destructive))]" />,
};

const moodDescriptions: Record<Mood, string> = {
    laugh: "You're feeling ecstatic!",
    smile: "You're feeling happy!",
    meh: "You're feeling alright.",
    frown: "You're feeling a bit down.",
    sad: "You're feeling sad.",
}

interface MoodEntryProps {
  journalText: string;
  setJournalText: (text: string) => void;
  onSave: (mood: Mood, text: string) => void;
  initialMood: string;
  hasPreviousEntry: boolean;
}

export default function MoodEntry({ journalText, setJournalText, onSave, initialMood, hasPreviousEntry }: MoodEntryProps) {
  const selectedMood = initialMood as Mood;

  const handleSave = () => {
    onSave(selectedMood, journalText);
  };

  const handleClear = () => {
    setJournalText('');
  }
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-4">
            {moodIcons[selectedMood]}
            <div>
                <CardTitle className="font-headline">Your Journal</CardTitle>
                <CardDescription>{moodDescriptions[selectedMood]}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPreviousEntry && !journalText && (
          <div className="text-center text-muted-foreground p-4 border rounded-md">
            <p>Your previous entry is saved. You can clear it to start a new one.</p>
          </div>
        )}
        <Textarea
          placeholder="Start writing your thoughts here..."
          className="min-h-[200px] resize-none"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {hasPreviousEntry && (
          <Button onClick={handleClear} variant="outline">
            <Eraser className="mr-2 h-4 w-4" />
            Start New
          </Button>
        )}
        <Button onClick={handleSave}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}
