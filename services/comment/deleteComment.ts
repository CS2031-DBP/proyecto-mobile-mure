import Api from "../api";

export async function deleteComment(commentId: number): Promise<void> {
    const api = await Api.getInstance();

    try {
        await api.delete({
            url: `/comments/${commentId}`,
        });
    } catch (error) {
        console.error("Error deleting comment", error);
        throw new Error("Failed to delete comment");
    }
}
