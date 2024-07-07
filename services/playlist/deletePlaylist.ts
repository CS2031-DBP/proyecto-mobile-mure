import Api from '../api';

const api = new Api({});

export async function deletePlaylist(playlistId: number) {
    try {
        const response = await api.delete({
            url: `/playlist/${playlistId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
