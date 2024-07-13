import Api from "../api";

export async function likeSong(songId: number): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.patch<null, void>(null, {
            url: `/songs/like/${songId}`,
        });
    } catch (error) {
        throw error;
    }
}
