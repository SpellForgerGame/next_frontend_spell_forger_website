import type { Spell } from '@/services/api';
import SpellsView from '@/views/Spells';

export const revalidate = 60;

async function fetchSpells(): Promise<Spell[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const response = await fetch(`${baseUrl}/spells`, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch spells');
  }

  return response.json();
}

export default async function SpellsPage() {
  let initialSpells: Spell[] = [];

  try {
    initialSpells = await fetchSpells();
  } catch (error) {
    console.error('Failed to load spells for ISR', error);
  }

  return <SpellsView initialSpells={initialSpells} />;
}
