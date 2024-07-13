import Api from "../api";

export async function dislikeSong(songId: number): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.patch<null, void>(null, {
            url: `/songs/dislike/${songId}`,
        });
    } catch (error) {
        throw error;
    }
}
