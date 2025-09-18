
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
  prompt: `You are an empathetic and supportive friend. Your goal is to provide a short, personalized nudge based on the user's journal entry and their current mood.

Your response should be tailored to their mood:
- If the mood is 'laugh' or 'smile' (happy/positive), generate a celebratory message that encourages them to savor the moment or reflects on their happiness. Don't provide a typical "motivational quote." Instead, say something that acknowledges and amplifies their good feelings.
- If the mood is 'frown' or 'sad' (negative), be especially encouraging and uplifting. Provide a quote that offers a positive perspective or a word of encouragement.
- If the mood is 'meh' (neutral), provide a gentle, reflective prompt to help them explore their feelings further.

Current Mood: {{{mood}}}
Recent Journal Entry:
"{{{recentJournalEntries}}}"

Generate a nudge that is directly related to the entry and mood.`,
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
