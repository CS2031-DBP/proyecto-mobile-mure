import { PostRequest } from "@/interfaces/Post";
import Api from "../api";

const api = new Api({});

export default async function createPost(postRequest: PostRequest) {
	try {
		await api.postForm<PostRequest, void>(postRequest, {
			url: "/post",
		});
	} catch (error) {
		throw error;
	}
}
