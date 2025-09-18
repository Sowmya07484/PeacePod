"use client";

import { useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Annoyed, Frown, Laugh, Meh, Smile, Sparkles } from "lucide-react";
import { getMotivationalQuote } from "@/app/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

type Mood = 'laugh' | 'smile' | 'meh' | 'frown' | 'annoyed';

const moodIcons: Record<Mood, React.ReactNode> = {
  laugh: <Laugh className="h-12 w-12" />,
  smile: <Smile className="h-12 w-12" />,
  meh: <Meh className="h-12 w-12" />,
  frown: <Frown className="h-12 w-12" />,
  annoyed: <Annoyed className="h-12 w-12" />,
};

interface MoodPromptPageProps {
  onMoodSelect: (mood: Mood) => void;
}

export default function MoodPromptPage({ onMoodSelect }: MoodPromptPageProps) {
  const [isPending, startTransition] = useTransition();
  const [quote, setQuote] = useState<string | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedMoodForJournal, setSelectedMoodForJournal] = useState<Mood | null>(null);


  const handleMoodClick = (mood: Mood) => {
    setSelectedMoodForJournal(mood);
    if (mood === 'frown' || mood === 'annoyed') {
      startTransition(async () => {
        const { quote } = await getMotivationalQuote("I'm having a bad day.");
        if (quote) {
          setQuote(quote);
          setShowQuoteDialog(true);
        } else {
          onMoodSelect(mood);
        }
      });
    } else {
      onMoodSelect(mood);
    }
  };

  const handleDialogClose = () => {
    setShowQuoteDialog(false);
    if(selectedMoodForJournal) {
        onMoodSelect(selectedMoodForJournal);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-purple-200 via-pink-200 to-red-200 p-4">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">How are you feeling today?</CardTitle>
          <CardDescription>Your response helps us understand your emotional well-being.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center space-x-2 sm:space-x-6 py-8">
          {Object.keys(moodIcons).map((mood) => (
            <Button
              key={mood}
              variant="ghost"
              size="icon"
              className="h-24 w-24 rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/50 focus:scale-110 focus:bg-white/50 text-gray-600"
              onClick={() => handleMoodClick(mood as Mood)}
              disabled={isPending}
            >
              {moodIcons[mood as Mood]}
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5"/> A little nudge for you
            </DialogTitle>
            <DialogDescription className="py-4">
              {isPending ? "Finding some encouragement for you..." : quote}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" onClick={handleDialogClose}>
                Continue to Journal
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
