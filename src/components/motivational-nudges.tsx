
"use client";

import { getMotivationalQuote } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

const defaultQuotes = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
];

interface MotivationalNudgesProps {
  recentEntry: string;
  mood: string;
}

export default function MotivationalNudges({ recentEntry, mood }: MotivationalNudgesProps) {
  const [quotes, setQuotes] = useState<string[]>(defaultQuotes);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateQuote = () => {
    if (!recentEntry) {
      toast({
        variant: "destructive",
        title: "No Journal Entry",
        description: "Please write a journal entry first to get a personalized quote.",
      });
      return;
    }

    startTransition(async () => {
      const { quote, error } = await getMotivationalQuote(recentEntry, mood);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      } else if (quote) {
        setQuotes(prev => [quote, ...prev]);
      }
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Motivational Nudges</CardTitle>
        <CardDescription>A little boost for your day, powered by AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full max-w-xl mx-auto">
          <CarouselContent>
            {quotes.map((quote, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="flex aspect-video items-center justify-center p-6 bg-secondary/50 rounded-lg">
                    <p className="text-xl font-semibold text-center text-secondary-foreground">{quote}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateQuote} disabled={isPending || !recentEntry} className="ml-auto">
          <Sparkles className="mr-2 h-4 w-4" />
          {isPending ? 'Generating...' : 'Get a New Nudge'}
        </Button>
      </CardFooter>
    </Card>
  );
}
