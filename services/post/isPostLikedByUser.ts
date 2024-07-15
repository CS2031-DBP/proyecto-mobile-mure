import Api from "../api";

export async function isPostLikedByUser(postId: number, userId: number) {
    const api = await Api.getInstance();

    try {
        const response = await api.get<null, boolean>({
            url: `/post/liked/${postId}/${userId}`,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to check if post is liked by user:', error);
        throw error;
    }
}
