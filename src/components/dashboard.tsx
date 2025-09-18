
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PenSquare, LineChart, Mic, Sparkles, Settings, Bell, History, AudioLines } from "lucide-react";

import AudioJournal from './audio-journal';
import MoodAnalytics from './mood-analytics';
import MoodEntry from './mood-entry';
import MotivationalNudges from './motivational-nudges';
import SettingsPanel from './settings-panel';
import WelcomeHeader from './welcome-header';
import { useEncryption } from '@/hooks/use-encryption';
import ReminderSettings from './reminder-settings';
import JournalHistory from './journal-history';
import VoiceNoteHistory from './voice-note-history';
import { useToast } from '@/hooks/use-toast';

export type JournalEntry = {
  mood: string;
  text: string;
  date: Date;
  isEncrypted?: boolean;
};

type SavedNote = {
  url: string;
  date: Date;
};

type User = {
  name: string;
  age: number;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
};

interface DashboardProps {
    initialMood: string;
    user: User;
}

const FeatureCard = ({ icon, title, description, children, onOpen }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode, onOpen?: () => void }) => (
  <Dialog onOpenChange={(open) => open && onOpen && onOpen()}>
    <DialogTrigger asChild>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          {icon}
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[625px]">
      {children}
    </DialogContent>
  </Dialog>
);


export default function Dashboard({ initialMood, user }: DashboardProps) {
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [showWellnessAlert, setShowWellnessAlert] = useState(false);
  const { isEncrypted, encrypt, decrypt } = useEncryption();
  const { toast } = useToast();

  useEffect(() => {
    // Clean up audio object URLs when component unmounts
    return () => {
      savedNotes.forEach(note => URL.revokeObjectURL(note.url));
    };
  }, [savedNotes]);
  
  const checkWellnessStatus = (entries: JournalEntry[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
    const recentEntries = entries.filter(entry => entry.date >= sevenDaysAgo);
    
    const uniqueDays = new Set(recentEntries.map(entry => entry.date.toDateString()));
  
    if (uniqueDays.size < 7) return; // Not enough data for a full week
  
    const lastSevenDaysEntries = Array.from(uniqueDays).map(dateString => {
      return recentEntries.find(entry => entry.date.toDateString() === dateString);
    }).filter(Boolean) as JournalEntry[];
  
    const allNegative = lastSevenDaysEntries.every(
      entry => entry.mood === 'frown' || entry.mood === 'sad'
    );
  
    if (allNegative) {
      if (user.age < 18 && user.guardianPhone) {
        toast({
            title: "Guardian Alert Sent",
            description: `A notification has been sent to your guardian at ${user.guardianPhone}.`,
            variant: "destructive",
        });
      } else if (user.age >= 18) {
        setShowWellnessAlert(true);
      }
    }
  };
  
  const handleSaveEntry = (mood: string, text: string) => {
    let newEntry: JournalEntry;
    if (isEncrypted) {
      const encryptedText = encrypt(text);
      newEntry = { mood, text: encryptedText, date: new Date(), isEncrypted: true };
    } else {
      newEntry = { mood, text, date: new Date(), isEncrypted: false };
    }
    
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    checkWellnessStatus(updatedEntries);
    // We don't clear journalText here anymore, to allow continuation.
  };

  const handleSaveNote = (note: SavedNote) => {
    setSavedNotes(prev => [note, ...prev]);
  };

  const handleDeleteNote = (index: number) => {
    const noteToDelete = savedNotes[index];
    URL.revokeObjectURL(noteToDelete.url);
    setSavedNotes(prev => prev.filter((_, i) => i !== index));
  };
  
  const getDecryptedEntry = (entry: JournalEntry) => {
    if (entry.isEncrypted && entry.text) {
        try {
            const decryptedText = decrypt(entry.text);
            return decryptedText;
        } catch (error) {
            console.error("Decryption failed:", error);
            return "This content is encrypted and could not be displayed.";
        }
    }
    return entry.text;
  };
  
  const handleJournalOpen = () => {
    if (journalEntries.length > 0) {
      setJournalText(getDecryptedEntry(journalEntries[0]));
    } else {
      setJournalText('');
    }
  }

  const latestJournalTextForNudge = journalEntries.length > 0 ? getDecryptedEntry(journalEntries[0]) : '';
  
  return (
    <div className="flex flex-col gap-6">
      <WelcomeHeader name={user.name} journalEntries={journalEntries} />

      <MotivationalNudges 
        recentEntry={latestJournalTextForNudge} 
        mood={initialMood}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <FeatureCard 
          icon={<PenSquare className="h-8 w-8 text-primary" />}
          title="Write Journal"
          description="Let out your thoughts for the day."
          onOpen={handleJournalOpen}
        >
          <MoodEntry 
            journalText={journalText} 
            setJournalText={setJournalText} 
            onSave={handleSaveEntry}
            initialMood={initialMood}
            hasPreviousEntry={journalEntries.length > 0}
          />
        </FeatureCard>

        <FeatureCard
          icon={<LineChart className="h-8 w-8 text-primary" />}
          title="Mood Analytics"
          description="Visualize your mood journey."
        >
          <MoodAnalytics entries={journalEntries} />
        </FeatureCard>

        <FeatureCard
          icon={<History className="h-8 w-8 text-primary" />}
          title="Journal History"
          description="Review your past entries."
        >
          <JournalHistory entries={journalEntries} getDecryptedText={getDecryptedEntry} />
        </FeatureCard>

        <FeatureCard
          icon={<Mic className="h-8 w-8 text-primary" />}
          title="Record Voice Note"
          description="Record your thoughts out loud."
        >
            <AudioJournal onSave={handleSaveNote} />
        </FeatureCard>

        <FeatureCard
          icon={<AudioLines className="h-8 w-8 text-primary" />}
          title="Voice Notes History"
          description="Listen to your past recordings."
        >
          <VoiceNoteHistory notes={savedNotes} onDelete={handleDeleteNote} />
        </FeatureCard>
        
        <FeatureCard
          icon={<Bell className="h-8 w-8 text-primary" />}
          title="Reminders"
          description="Set notifications for journaling."
        >
          <ReminderSettings />
        </FeatureCard>

        <FeatureCard
          icon={<Settings className="h-8 w-8 text-primary" />}
          title="Settings & Export"
          description="Manage your data and privacy."
        >
          <SettingsPanel entries={journalEntries} getDecryptedText={getDecryptedEntry} />
        </FeatureCard>
      </div>

      <AlertDialog open={showWellnessAlert} onOpenChange={setShowWellnessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>We're Here For You</AlertDialogTitle>
            <AlertDialogDescription>
              We've noticed you've been feeling down for a while. Remember, it's okay to not be okay, and reaching out for help is a sign of strength. Please consider talking to a friend, family member, or a professional.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowWellnessAlert(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
