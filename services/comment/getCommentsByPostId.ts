import Api from "../api";
import { CommentResponseDto } from "@/interfaces/Comment";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";

export async function getCommentsByPostId(postId: number, page: number, size: number): Promise<PaginatedResponse<CommentResponseDto>> {
    const api = await Api.getInstance();

    try {
        const response = await api.get<void, PaginatedResponse<CommentResponseDto>>({
            url: `/comments/post/${postId}`,
            params: { page, size },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching comments", error);
        throw new Error("Failed to fetch comments");
    }
}
