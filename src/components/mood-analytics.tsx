"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

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

const moodColors: Record<string, string> = {
    laugh: "hsl(var(--chart-3))", // Yellow
    smile: "hsl(var(--chart-4))", // Green
    meh: "hsl(var(--muted-foreground))", // Gray
    frown: "hsl(var(--chart-1))", // Blue
    annoyed: "hsl(var(--destructive))", // Red
};

interface MoodAnalyticsProps {
  entries: { mood: string, date: Date }[];
}

export default function MoodAnalytics({ entries }: MoodAnalyticsProps) {
  // Use last 7 entries for the chart
  const chartData = entries.slice(0, 7).reverse().map(entry => ({
    date: entry.date.toLocaleDateString('en-US', { weekday: 'short' }),
    moodValue: moodToValue[entry.mood],
    mood: entry.mood,
  }));
  
  const placeholderData = [
    { date: "Mon", moodValue: 4, mood: 'smile' },
    { date: "Tue", moodValue: 2, mood: 'frown' },
    { date: "Wed", moodValue: 3, mood: 'meh' },
    { date: "Thu", moodValue: 5, mood: 'laugh' },
    { date: "Fri", moodValue: 4, mood: 'smile' },
    { date: "Sat", moodValue: 3, mood: 'meh' },
    { date: "Sun", moodValue: 1, mood: 'annoyed' },
  ];

  const dataToDisplay = chartData.length > 0 ? chartData : placeholderData;

  const chartConfig = {
    mood: {
      label: "Mood",
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
              dataKey="moodValue"
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => valueToMood[value]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="moodValue" radius={4}>
                {dataToDisplay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={moodColors[entry.mood]} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
