import { PostResponse } from "@/interfaces/Post";
import Api from "../api";
import { AxiosRequestConfig } from "axios";

const api = new Api({});

export async function getUserPosts() {
	const options: AxiosRequestConfig = {
		url: "/post/me",
	};

	try {
		const response = await api.get<null, PostResponse[]>(options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
