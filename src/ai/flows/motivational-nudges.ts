'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized motivational quotes based on recent journal entries.
 *
 * The flow takes recent journal entries as input and returns a motivational quote tailored to the user's emotional state.
 * - generateMotivationalQuote - A function that generates a motivational quote based on recent journal entries.
 * - MotivationalQuoteInput - The input type for the generateMotivationalQuote function.
 * - MotivationalQuoteOutput - The return type for the generateMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalQuoteInputSchema = z.object({
  recentJournalEntries: z
    .string()
    .describe('The recent journal entries of the user.'),
});
export type MotivationalQuoteInput = z.infer<typeof MotivationalQuoteInputSchema>;

const MotivationalQuoteOutputSchema = z.object({
  motivationalQuote: z.string().describe('A personalized motivational quote.'),
});
export type MotivationalQuoteOutput = z.infer<typeof MotivationalQuoteOutputSchema>;

export async function generateMotivationalQuote(input: MotivationalQuoteInput): Promise<MotivationalQuoteOutput> {
  return motivationalNudgesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motivationalNudgesPrompt',
  input: {schema: MotivationalQuoteInputSchema},
  output: {schema: MotivationalQuoteOutputSchema},
  prompt: `You are a motivational quote generator. You will generate a motivational quote based on the user's recent journal entries.

Recent Journal Entries: {{{recentJournalEntries}}}

Motivational Quote:`,
});

const motivationalNudgesFlow = ai.defineFlow(
  {
    name: 'motivationalNudgesFlow',
    inputSchema: MotivationalQuoteInputSchema,
    outputSchema: MotivationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
