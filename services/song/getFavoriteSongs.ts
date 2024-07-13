import Api from "../api";
import { SongResponse } from "@/interfaces/Song";

export async function getFavoriteSongs(userId: number): Promise<SongResponse[]> {
    const api = await Api.getInstance();

    try {
        const response = await api.get<null, SongResponse[]>({
            url: `/user/favoriteSongs/${userId}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
