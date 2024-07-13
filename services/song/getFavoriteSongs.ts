import Api from "../api";
import { SongResponse } from "@/interfaces/Song";

export async function getFavoriteSongs(userId: number): Promise<SongResponse[]> {
    const api = await Api.getInstance();

    try {
        console.log(`Fetching favorite songs for user ID: ${userId}`);
        const response = await api.get<null, SongResponse[]>({
            url: `/user/favoriteSongs/${userId}`,
        });
        console.log('Favorite songs response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching favorite songs:", error);
        throw error;
    }
}
