import Api from "../api";
import { IsFriendResponse } from "@/interfaces/User";

const api = new Api({});

export async function isFriend(userId: number): Promise<IsFriendResponse> {
    const options = {
        url: `/user/me/friends/${userId}`,
    };

    try {
        const response = await api.get<null, IsFriendResponse>(options);
        return response.data;
    } catch (error) {
        throw error;
    }
}
