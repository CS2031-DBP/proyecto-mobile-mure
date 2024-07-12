import Api from "../api";

export async function deletePostById(postId: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.delete({
			url: `/post/${postId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
