import type { Spell } from '@/services/api';
import SpellsView from '@/views/Spells';
import axios from 'axios';

export const revalidate = 10;

async function fetchSpells(): Promise<Spell[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  const formData = new URLSearchParams();
  formData.append('username', process.env.USER_NAME!);
  formData.append('password', process.env.USER_PASSWORD!);

  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const loginResponse = await apiClient.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const response = await fetch(`${baseUrl}/spells`, {
    next: { revalidate },
    headers: {
      Authorization: `Bearer ${loginResponse.data.access_token}`
    }
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
