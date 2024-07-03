import Api from "../api";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import { Post } from "@/interfaces/Post";

const api = new Api({});

export async function getPosts(page: number, size: number) {
	try {
		const response = await api.get<null, PaginatedResponse<Post>>({
			url: `/post/all?page=${page}&size=${size}`,
		});
		return response;
	} catch (error) {
		throw error;
	}
}
