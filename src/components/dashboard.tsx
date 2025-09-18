
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PenSquare, LineChart, Mic, Sparkles, Settings } from "lucide-react";

import AudioJournal from './audio-journal';
import MoodAnalytics from './mood-analytics';
import MoodEntry from './mood-entry';
import MotivationalNudges from './motivational-nudges';
import SettingsPanel from './settings-panel';
import WelcomeHeader from './welcome-header';

type JournalEntry = {
  mood: string;
  text: string;
  date: Date;
};

interface DashboardProps {
    initialMood: string;
}

const FeatureCard = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children: React.ReactNode }) => (
  <Dialog>
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

  const handleSaveEntry = (mood: string, text: string) => {
    const newEntry = { mood, text, date: new Date() };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalText(''); // Clear text area after saving
  };
  
  return (
    <div className="flex flex-col gap-6">
      <WelcomeHeader name="User" entryCount={journalEntries.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <FeatureCard 
          icon={<PenSquare className="h-8 w-8 text-primary" />}
          title="Write Journal"
          description="Let out your thoughts for the day."
        >
          <MoodEntry 
            journalText={journalText} 
            setJournalText={setJournalText} 
            onSave={handleSaveEntry}
            initialMood={initialMood}
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
          icon={<Sparkles className="h-8 w-8 text-primary" />}
          title="Get a Nudge"
          description="AI-powered motivational quotes."
        >
          <MotivationalNudges recentEntry={journalText || (journalEntries[0]?.text || '')} />
        </FeatureCard>

        <FeatureCard
          icon={<Mic className="h-8 w-8 text-primary" />}
          title="Voice Note"
          description="Record your thoughts out loud."
        >
            <AudioJournal />
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
