"use client";

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard';
import Header from '@/components/header';
import LoginPage from '@/components/login-page';
import MoodPromptPage from '@/components/mood-prompt-page';

type User = {
  name: string;
  age: number;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [moodSelected, setMoodSelected] = useState(false);
  const [initialMood, setInitialMood] = useState<string | null>(null);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('reflectwell-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAppLoaded(true);
  }, []);

  const handleLogin = (details: Omit<User, 'name' | 'age'> & {name: string; age: number}) => {
    const newUser: User = { ...details };
    setUser(newUser);
    localStorage.setItem('reflectwell-user', JSON.stringify(newUser));
  };
  
  const handleLogout = () => {
    setUser(null);
    setMoodSelected(false);
    setInitialMood(null);
    localStorage.removeItem('reflectwell-user');
  }

  const handleMoodSelect = (mood: string) => {
    setInitialMood(mood);
    setMoodSelected(true);
  }

  if (!appLoaded) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  if (!moodSelected) {
    return <MoodPromptPage onMoodSelect={handleMoodSelect} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Dashboard initialMood={initialMood as string} />
      </main>
    </div>
  );
}
