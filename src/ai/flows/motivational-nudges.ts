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
  mood: z.string().describe("The user's current mood."),
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
  prompt: `You are an empathetic and supportive friend. Your goal is to provide a short, personalized motivational quote based on the user's journal entry and their current mood. If the entry seems negative, sad, or indicates a bad day, or if their mood is negative, be especially encouraging and uplifting.

Current Mood: {{{mood}}}
Recent Journal Entry:
"{{{recentJournalEntries}}}"

Generate a quote that is directly related to the entry and mood, and offers a positive perspective or a word of encouragement.`,
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
