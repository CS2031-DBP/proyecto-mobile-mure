import Api from "../api";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import { PostResponse } from "@/interfaces/Post";

const api = new Api({});

export async function getPostsByUserId(userId: number, page: number, size: number) {
    try {
        const response = await api.get<null, PaginatedResponse<PostResponse>>({
            url: `/post/user/${userId}?page=${page}&size=${size}`,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
