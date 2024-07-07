import Api from '../api';

const api = new Api({});

export async function addSongToPlaylist(playlistId : number, songId: number) {
    try {
        const response = await api.patch<null, void>(null, {
            url: `/playlist/${playlistId}/addSong/${songId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
