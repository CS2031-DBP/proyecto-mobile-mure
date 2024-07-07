// src/services/song/getSongById.ts
import Api from '../api';
import { SongResponse } from '@/interfaces/Song';

const api = new Api({});

export async function getSongById(songId: number) {
  try {
    const response = await api.get<null, SongResponse>({
      url: `/songs/${songId}`,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to load song data for songId ${songId}:`, error);
    throw error;
  }
}
