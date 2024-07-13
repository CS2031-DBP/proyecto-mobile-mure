import Api from "../api";

export async function dislikeAlbum(albumId: number): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.post<null, void>(null, {
            url: `/album/dislike/${albumId}`,
        });
    } catch (error) {
        throw error;
    }
}
