
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Annoyed, Frown, Laugh, Meh, Smile } from "lucide-react";

type Mood = 'laugh' | 'smile' | 'meh' | 'frown' | 'annoyed';

const moodIcons: Record<Mood, React.ReactNode> = {
  laugh: <Laugh className="h-8 w-8 text-[hsl(var(--chart-3))]" />,
  smile: <Smile className="h-8 w-8 text-[hsl(var(--chart-4))]" />,
  meh: <Meh className="h-8 w-8 text-muted-foreground" />,
  frown: <Frown className="h-8 w-8 text-[hsl(var(--chart-1))]" />,
  annoyed: <Annoyed className="h-8 w-8 text-[hsl(var(--destructive))]" />,
};

const moodDescriptions: Record<Mood, string> = {
    laugh: "You're feeling ecstatic!",
    smile: "You're feeling happy!",
    meh: "You're feeling alright.",
    frown: "You're feeling a bit down.",
    annoyed: "You're feeling annoyed.",
}

interface MoodEntryProps {
  journalText: string;
  setJournalText: (text: string) => void;
  onSave: (mood: Mood, text: string) => void;
  initialMood: string;
}

export default function MoodEntry({ journalText, setJournalText, onSave, initialMood }: MoodEntryProps) {
  const selectedMood = initialMood as Mood;

  const handleSave = () => {
    onSave(selectedMood, journalText);
  };
  
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
