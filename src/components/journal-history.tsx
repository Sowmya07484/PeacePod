
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Frown, Laugh, Meh, Smile, Angry, History } from "lucide-react";

type Mood = 'laugh' | 'smile' | 'meh' | 'frown' | 'sad';
type JournalEntry = {
    mood: string;
    text: string;
    date: Date;
    isEncrypted?: boolean;
};

const moodIcons: Record<Mood, React.ReactNode> = {
  laugh: <Laugh className="h-6 w-6 text-[hsl(var(--chart-3))]" />,
  smile: <Smile className="h-6 w-6 text-[hsl(var(--chart-4))]" />,
  meh: <Meh className="h-6 w-6 text-muted-foreground" />,
  frown: <Frown className="h-6 w-6 text-[hsl(var(--chart-1))]" />,
  sad: <Angry className="h-6 w-6 text-[hsl(var(--destructive))]" />,
};


interface JournalHistoryProps {
  entries: JournalEntry[];
  getDecryptedText: (entry: JournalEntry) => string;
}

export default function JournalHistory({ entries, getDecryptedText }: JournalHistoryProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><History /> Journal History</CardTitle>
        <CardDescription>A complete log of all your past journal entries.</CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border rounded-md">
            <p>You haven't written any journal entries yet.</p>
            <p>Once you do, they will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <Accordion type="single" collapsible className="w-full">
              {entries.map((entry, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-4">
                      {moodIcons[entry.mood as Mood]}
                      <div>
                        <p className="font-semibold">
                          {entry.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-muted-foreground text-left">
                          {entry.date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base pl-14">
                    {getDecryptedText(entry)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
