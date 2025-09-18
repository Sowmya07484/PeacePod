
"use client";

import { useState, useTransition, useEffect } from 'react';
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

const moodReactions: Record<Mood, {icon: React.ReactNode, message: string}> = {
    laugh: { icon: <Laugh className="h-24 w-24 text-yellow-500" />, message: "It's great to see you so happy!" },
    smile: { icon: <Smile className="h-24 w-24 text-green-500" />, message: "Glad you're having a good day!" },
    meh: { icon: <Meh className="h-24 w-24 text-gray-500" />, message: "Just a regular day, huh? That's okay." },
    frown: { icon: <Frown className="h-24 w-24 text-blue-500" />, message: "Sorry to hear you're feeling down." },
    annoyed: { icon: <Annoyed className="h-24 w-24 text-red-500" />, message: "It's okay to feel annoyed sometimes." },
};

interface MoodPromptPageProps {
  onMoodSelect: (mood: Mood) => void;
}

export default function MoodPromptPage({ onMoodSelect }: MoodPromptPageProps) {
  const [isPending, startTransition] = useTransition();
  const [quote, setQuote] = useState<string | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);


  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
  };

  useEffect(() => {
    if (selectedMood) {
      const timer = setTimeout(() => {
        if (selectedMood === 'frown' || selectedMood === 'annoyed') {
            startTransition(async () => {
              const { quote } = await getMotivationalQuote("I'm having a bad day.", selectedMood);
              if (quote) {
                setQuote(quote);
                setShowQuoteDialog(true);
              } else {
                onMoodSelect(selectedMood);
              }
            });
          } else {
            onMoodSelect(selectedMood);
          }
      }, 1500); // 1.5 second delay to show reaction
      return () => clearTimeout(timer);
    }
  }, [selectedMood, onMoodSelect]);

  const handleDialogClose = () => {
    setShowQuoteDialog(false);
    if(selectedMood) {
        onMoodSelect(selectedMood);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-purple-200 via-pink-200 to-red-200 p-4">
      <Card className="w-full max-w-md shadow-2xl text-center transition-all duration-500">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            {selectedMood ? moodReactions[selectedMood].message : 'How are you feeling today?'}
          </CardTitle>
          {!selectedMood && <CardDescription>Your response helps us understand your emotional well-being.</CardDescription>}
        </CardHeader>
        <CardContent className="flex justify-center items-center space-x-2 sm:space-x-6 py-8 transition-opacity duration-300">
          {selectedMood ? (
             <div className="animate-in fade-in zoom-in-50 duration-500">
                {moodReactions[selectedMood].icon}
             </div>
          ) : (
            Object.keys(moodIcons).map((mood) => (
              <Button
                key={mood}
                variant="ghost"
                size="icon"
                className="h-24 w-24 rounded-full transition-transform duration-300 ease-in-out hover:scale-110 hover:bg-white/50 focus:scale-110 focus:bg-white/50 text-gray-600"
                onClick={() => handleMoodClick(mood as Mood)}
                disabled={isPending || !!selectedMood}
              >
                {moodIcons[mood as Mood]}
              </Button>
            ))
          )}
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
