import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { IsFriendResponse } from "@/interfaces/User";

const api = new Api({});

export async function isFriend(userId: number) {
	const options: AxiosRequestConfig = {
		url: `/user/me/friends/${userId}`,
	};

	try {
		const response = await api.get<null, IsFriendResponse>(options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
