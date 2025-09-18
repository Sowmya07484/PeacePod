
"use client";

import { useState, useEffect, useCallback } from 'react';
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
const LOCAL_STORAGE_KEY_REMINDERS = 'peace-pod-reminders';

type ReminderSettings = {
  enabled: boolean;
  time: string;
  days: number[];
};

export default function ReminderSettings() {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_REMINDERS);
      if (storedSettings) {
        const { enabled, time, days } = JSON.parse(storedSettings) as ReminderSettings;
        setRemindersEnabled(enabled);
        setReminderTime(time);
        setSelectedDays(days);
      }
    } catch (error) {
      console.error("Failed to load reminders from local storage", error);
    }
  }, []);

  useEffect(() => {
    if (remindersEnabled && notificationPermission === 'granted') {
      const interval = setInterval(() => {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_REMINDERS);
        if (storedSettings) {
          const { enabled, time, days } = JSON.parse(storedSettings) as ReminderSettings;
          if (enabled && days.includes(currentDay) && time === currentTime) {
            new Notification("Time to Journal!", {
              body: "Take a moment for yourself and write down your thoughts.",
              icon: "/logo.svg", // Assuming you have a logo in public folder
            });
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [remindersEnabled, notificationPermission]);

  const handleToggleReminders = async (enabled: boolean) => {
    if (enabled) {
      if (!("Notification" in window)) {
        toast({
          variant: "destructive",
          title: "Notifications not supported",
          description: "Your browser does not support desktop notifications.",
        });
        setRemindersEnabled(false);
        return;
      }

      if (notificationPermission === 'granted') {
        setRemindersEnabled(true);
      } else if (notificationPermission !== 'denied') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          setRemindersEnabled(true);
        } else {
          setRemindersEnabled(false);
          toast({
            variant: "destructive",
            title: "Notifications Disabled",
            description: "You need to grant permission to enable reminders.",
          });
        }
      } else {
         toast({
            variant: "destructive",
            title: "Notifications Blocked",
            description: "You have blocked notifications. Please enable them in your browser settings.",
          });
        setRemindersEnabled(false);
      }
    } else {
      setRemindersEnabled(false);
      handleSave(false); // Also save the disabled state
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };
  
  const handleSave = (enabledState = remindersEnabled) => {
    if (enabledState && notificationPermission !== 'granted') {
       toast({
        variant: "destructive",
        title: "Cannot Save Reminders",
        description: "Please enable notifications in your browser to save reminder settings.",
      });
      return;
    }
    
    const settings: ReminderSettings = {
      enabled: enabledState,
      time: reminderTime,
      days: selectedDays,
    };
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_REMINDERS, JSON.stringify(settings));
      toast({
        title: "Reminders Saved",
        description: enabledState ? `You will be notified at ${reminderTime} on selected days.` : "Your reminder preferences have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your preferences.",
      });
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Bell />Set Journal Reminders</CardTitle>
        <CardDescription>Stay consistent with gentle nudges to write. This uses your browser's notification system.</CardDescription>
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
              onCheckedChange={handleToggleReminders}
              aria-label="Toggle reminders"
            />
        </div>
        
        {remindersEnabled && (
          <div className="space-y-4 animate-in fade-in-0 duration-500">
            <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time (24-hour format)</Label>
                <Input 
                    id="reminder-time"
                    type="time" 
                    value={reminderTime} 
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full"
                    pattern="[0-9]{2}:[0-9]{2}"
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
            <Button onClick={() => handleSave()} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
