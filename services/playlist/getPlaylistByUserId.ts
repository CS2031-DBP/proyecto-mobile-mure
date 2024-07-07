import Api from '../api';
import { PlaylistResponse } from '@/interfaces/Playlist';
const api = new Api({});

export async function getPlaylistsByUserId(userId: number) {
    const options = {
        url: `/playlist/user/${userId}`,
    };

    try {
        const response = await api.get<null, PlaylistResponse[]>(options);
        return response.data;
    } catch (error) {
        throw error;
    }
}
