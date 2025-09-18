
import { Card, CardContent } from "@/components/ui/card";
import { Book, Calendar, Star } from "lucide-react";

interface WelcomeHeaderProps {
    name: string;
    entryCount: number;
}

export default function WelcomeHeader({ name, entryCount }: WelcomeHeaderProps) {
    const memberSince = "June 2024"; // Placeholder

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold font-headline">Welcome back, {name}!</h1>
            <p className="text-muted-foreground">Here is your wellness dashboard for today.</p>
            <div className="grid gap-4 md:grid-cols-3 pt-4">
                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                            <p className="text-2xl font-bold">1</p>
                        </div>
                        <Book className="h-8 w-8 text-primary" />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center justify-between p-4">
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Journaling Streak</p>
                            <p className="text-2xl font-bold">1 Day</p>
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
