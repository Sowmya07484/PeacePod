"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const moodToValue: Record<string, number> = {
  laugh: 5,
  smile: 4,
  meh: 3,
  frown: 2,
  annoyed: 1,
};

const valueToMood: Record<number, string> = {
  5: 'Ecstatic',
  4: 'Happy',
  3: 'Neutral',
  2: 'Sad',
  1: 'Annoyed',
};

interface MoodAnalyticsProps {
  entries: { mood: string, date: Date }[];
}

export default function MoodAnalytics({ entries }: MoodAnalyticsProps) {
  // Use last 7 entries for the chart
  const chartData = entries.slice(0, 7).reverse().map(entry => ({
    date: entry.date.toLocaleDateString('en-US', { weekday: 'short' }),
    mood: moodToValue[entry.mood],
  }));
  
  const placeholderData = [
    { date: "Mon", mood: 4 },
    { date: "Tue", mood: 2 },
    { date: "Wed", mood: 3 },
    { date: "Thu", mood: 5 },
    { date: "Fri", mood: 4 },
    { date: "Sat", mood: 3 },
    { date: "Sun", mood: 2 },
  ];

  const dataToDisplay = chartData.length > 0 ? chartData : placeholderData;

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Mood Journey</CardTitle>
        <CardDescription>A look at your mood over the last week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart accessibilityLayer data={dataToDisplay} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
             <YAxis
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => valueToMood[value]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="mood" fill="var(--color-mood)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
