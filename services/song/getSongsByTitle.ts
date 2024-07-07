import Api from '../api';
import { SongResponse } from '@/interfaces/Song';

const api = new Api({});

export async function getSongsByTitle(title: string, page: number, size: number): Promise<SongResponse[]> {
    try {
        console.log(`Requesting songs with title: ${title}, page: ${page}, size: ${size}`);
        const response = await api.get<null, { content: SongResponse[] }>({
            url: `/songs/title?title=${title}&page=${page}&size=${size}`,
        });
        console.log('API response:', response.data);
        return response.data.content;
    } catch (error) {
        console.error('Error in getSongsByTitle:', error);
        throw error;
    }
}
