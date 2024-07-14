import Api from "../api";
import { CommentRequestDto } from "@/interfaces/Comment";

export async function createComment(comment: CommentRequestDto): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.post<CommentRequestDto, void>(comment, {
            url: "/comments",
        });
    } catch (error) {
        console.error("Error creating comment", error);
        throw new Error("Failed to create comment");
    }
}
