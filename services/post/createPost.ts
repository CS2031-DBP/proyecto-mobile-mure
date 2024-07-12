import { PostRequest } from "@/interfaces/Post";
import Api from "../api";

export default async function createPost(postRequest: PostRequest) {
	const api = await Api.getInstance();

	try {
		await api.postForm<PostRequest, void>(postRequest, {
			url: "/post",
		});
	} catch (error) {
		throw error;
	}
}
