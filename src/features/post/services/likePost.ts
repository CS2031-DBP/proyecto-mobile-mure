import Api from "../../../shared/services/api";

export async function likePost(postId: number): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.patch<null, void>(null, {
			url: `/post/like/${postId}`,
		});
	} catch (error) {
		throw error;
	}
}
