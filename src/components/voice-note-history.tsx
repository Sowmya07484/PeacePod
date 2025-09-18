
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, AudioLines } from "lucide-react";
import { SavedNotePlayer } from './saved-note-player';
import { useToast } from "@/hooks/use-toast";

type SavedNote = {
  url: string;
  date: Date;
};

interface VoiceNoteHistoryProps {
  notes: SavedNote[];
  onDelete: (index: number) => void;
}

export default function VoiceNoteHistory({ notes, onDelete }: VoiceNoteHistoryProps) {
  const { toast } = useToast();

  const handleDelete = (index: number) => {
    onDelete(index);
    toast({
      title: "Note Deleted",
      description: "The voice note has been removed.",
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><AudioLines /> Voice Notes History</CardTitle>
        <CardDescription>A complete log of all your past voice notes.</CardDescription>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border rounded-md">
            <p>You haven't recorded any voice notes yet.</p>
            <p>Once you do, they will appear here.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {note.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, {note.date.toLocaleTimeString()}
                    </p>
                    <SavedNotePlayer audioUrl={note.url} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete note</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
