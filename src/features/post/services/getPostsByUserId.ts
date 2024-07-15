import Api from "../../../shared/services/api";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import { PostResponse } from "@/interfaces/Post";

export async function getPostsByUserId(
	userId: number,
	page: number,
	size: number
) {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, PaginatedResponse<PostResponse>>({
			url: `/post/user/${userId}?page=${page}&size=${size}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
