
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar, Star } from "lucide-react";
import { useState, useEffect } from "react";
import type { JournalEntry } from './dashboard';

interface WelcomeHeaderProps {
    name: string;
    journalEntries: JournalEntry[];
}

// Helper function to check if two dates are on the same day
const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

// Helper function to calculate the streak
const calculateStreak = (entries: JournalEntry[]): number => {
    if (entries.length === 0) {
        return 0;
    }

    const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());

    // Remove duplicate entries on the same day, keeping only the most recent
    const uniqueDayEntries: JournalEntry[] = [];
    const seenDays = new Set<string>();

    for (const entry of sortedEntries) {
        const dayString = entry.date.toDateString();
        if (!seenDays.has(dayString)) {
            uniqueDayEntries.push(entry);
            seenDays.add(dayString);
        }
    }
    
    let streak = 0;
    let today = new Date();
    
    // Check if there is an entry for today
    const hasEntryToday = uniqueDayEntries.some(entry => isSameDay(entry.date, today));
    
    if (hasEntryToday) {
        streak = 1;
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        for (let i = 1; i < uniqueDayEntries.length; i++) {
            const entryDate = uniqueDayEntries[i].date;
            if (isSameDay(entryDate, yesterday)) {
                streak++;
                yesterday.setDate(yesterday.getDate() - 1);
            } else {
                break; // Streak is broken
            }
        }
    }

    return streak;
};


export default function WelcomeHeader({ name, journalEntries }: WelcomeHeaderProps) {
    const [memberSince, setMemberSince] = useState('');
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        setMemberSince(`${month} ${year}`);
    }, []);

    useEffect(() => {
        setStreak(calculateStreak(journalEntries));
    }, [journalEntries]);

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold font-headline">Welcome back, {name}!</h1>
            <p className="text-muted-foreground">Here is your wellness dashboard for today.</p>
            <div className="grid gap-4 md:grid-cols-3 pt-4">
                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                            <p className="text-2xl font-bold">{journalEntries.length}</p>
                        </div>
                        <Book className="h-8 w-8 text-primary" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Journaling Streak</p>
                            <p className="text-2xl font-bold">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-500" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                            <p className="text-2xl font-bold">{memberSince}</p>
                        </div>
                        <Calendar className="h-8 w-8 text-accent" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
