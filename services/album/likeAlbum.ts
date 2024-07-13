import Api from "../api";

export async function likeAlbum(albumId: number): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.post<null, void>(null, {
            url: `/album/like/${albumId}`,
        });
    } catch (error) {
        throw error;
    }
}
