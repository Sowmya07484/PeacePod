
'use server';

import { generateMotivationalQuote } from '@/ai/flows/motivational-nudges';

export async function getMotivationalQuote(journalEntry: string) {
  try {
    const result = await generateMotivationalQuote({
      recentJournalEntries: journalEntry,
    });
    return { quote: result.motivationalQuote, error: null };
  } catch (e: any) {
    console.error(e);
    return { quote: null, error: 'Failed to generate a quote. Please try again.' };
  }
}
