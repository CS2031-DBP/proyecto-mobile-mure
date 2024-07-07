import Api from '../api';
import { PlaylistRequest } from '@/interfaces/Playlist';

const api = new Api({});

export async function createPlaylist(playlist: PlaylistRequest): Promise<void> {
  try {
    await api.post<PlaylistRequest[], void>([playlist], { url: '/playlist' });
  } catch (error) {
    throw new Error('Failed to create playlist');
  }
}
