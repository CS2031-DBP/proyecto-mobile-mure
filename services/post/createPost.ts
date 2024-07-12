import { PostRequest } from "@/interfaces/Post";
import Api from "../api";

const api = new Api({});

export default async function createPost(postRequest: object) {
	try {
		console.log("Creating post..");
		await api.postForm<object, void>(postRequest, {
			url: "/post",
		});
		console.log("Post created successfully");
	} catch (error) {
		throw error;
	}
}
