
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ReminderSettings() {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const { toast } = useToast();

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    // This is a mock save. In a real app, you'd save this to a backend or local storage.
    toast({
      title: "Reminders Saved",
      description: "Your notification preferences have been updated.",
    });
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Bell />Set Journal Reminders</CardTitle>
        <CardDescription>Stay consistent with gentle nudges to write.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="reminders-switch" className="text-base">
                Enable Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get periodic notifications to journal.
              </p>
            </div>
            <Switch
              id="reminders-switch"
              checked={remindersEnabled}
              onCheckedChange={setRemindersEnabled}
              aria-label="Toggle reminders"
            />
        </div>
        
        {remindersEnabled && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Input 
                    id="reminder-time"
                    type="time" 
                    value={reminderTime} 
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <Label>Repeat on Days</Label>
                <div className="flex justify-center space-x-1 sm:space-x-2">
                    {daysOfWeek.map((day, index) => (
                        <Button 
                            key={index} 
                            variant="outline"
                            size="icon"
                            onClick={() => handleDayToggle(index)}
                            className={cn("h-10 w-10 rounded-full", selectedDays.includes(index) && "bg-primary text-primary-foreground")}
                            aria-label={`Toggle reminder for ${dayLabels[index]}`}
                        >
                            {day}
                        </Button>
                    ))}
                </div>
            </div>
          </div>
        )}
      </CardContent>
      {remindersEnabled && (
        <CardFooter>
            <Button onClick={handleSave} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
