"use client";

import { useState } from 'react';
import AudioJournal from './audio-journal';
import MoodAnalytics from './mood-analytics';
import MoodEntry from './mood-entry';
import MotivationalNudges from './motivational-nudges';
import SettingsPanel from './settings-panel';

type JournalEntry = {
  mood: string;
  text: string;
  date: Date;
};

interface DashboardProps {
    initialMood: string;
}

export default function Dashboard({ initialMood }: DashboardProps) {
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const handleSaveEntry = (mood: string, text: string) => {
    const newEntry = { mood, text, date: new Date() };
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalText(''); // Clear text area after saving
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <MoodEntry 
          journalText={journalText} 
          setJournalText={setJournalText} 
          onSave={handleSaveEntry}
          initialMood={initialMood}
        />
        <MotivationalNudges recentEntry={journalText || (journalEntries[0]?.text || '')} />
      </div>
      <div className="lg:col-span-1 flex flex-col gap-6">
        <MoodAnalytics entries={journalEntries} />
        <AudioJournal />
        <SettingsPanel />
      </div>
    </div>
  );
}
