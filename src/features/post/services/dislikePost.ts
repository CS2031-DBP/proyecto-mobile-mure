import Api from "../../../shared/services/api";

export async function dislikePost(postId: number): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.patch<null, void>(null, {
			url: `/post/dislike/${postId}`,
		});
	} catch (error) {
		throw error;
	}
}
