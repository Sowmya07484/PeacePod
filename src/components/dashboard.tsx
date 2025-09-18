
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PenSquare, LineChart, Mic, Sparkles, Settings, Bell, History } from "lucide-react";

import AudioJournal from './audio-journal';
import MoodAnalytics from './mood-analytics';
import MoodEntry from './mood-entry';
import MotivationalNudges from './motivational-nudges';
import SettingsPanel from './settings-panel';
import WelcomeHeader from './welcome-header';
import { useEncryption } from '@/hooks/use-encryption';
import ReminderSettings from './reminder-settings';
import JournalHistory from './journal-history';

type JournalEntry = {
  mood: string;
  text: string;
  date: Date;
  isEncrypted?: boolean;
};

interface DashboardProps {
    initialMood: string;
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


export default function Dashboard({ initialMood }: DashboardProps) {
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { isEncrypted, encrypt, decrypt } = useEncryption();

  useEffect(() => {
    // This is a mock-up to simulate loading a single entry.
    const mockEntry = {
      mood: 'smile',
      text: "Today was a good day! I went for a walk in the park and enjoyed the sunshine. Feeling grateful.",
      date: new Date(), // Set to today
      isEncrypted: false,
    };
    setJournalEntries([mockEntry]);
  }, []);

  const handleSaveEntry = (mood: string, text: string) => {
    let newEntry: JournalEntry;
    if (isEncrypted) {
      const encryptedText = encrypt(text);
      newEntry = { mood, text: encryptedText, date: new Date(), isEncrypted: true };
    } else {
      newEntry = { mood, text, date: new Date(), isEncrypted: false };
    }
    
    setJournalEntries(prev => [newEntry, ...prev]);
    // We don't clear journalText here anymore, to allow continuation.
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
      <WelcomeHeader name="User" entryCount={journalEntries.length} />

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
          icon={<Sparkles className="h-8 w-8 text-primary" />}
          title="Get a Nudge"
          description="AI-powered motivational quotes."
        >
          <MotivationalNudges 
            recentEntry={latestJournalTextForNudge} 
            mood={initialMood}
          />
        </FeatureCard>

        <FeatureCard
          icon={<Mic className="h-8 w-8 text-primary" />}
          title="Voice Notes"
          description="Record & review voice notes."
        >
            <AudioJournal />
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
          <SettingsPanel />
        </FeatureCard>
      </div>
    </div>
  );
}
