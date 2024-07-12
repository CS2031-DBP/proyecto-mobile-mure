import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { IsFriendResponse } from "@/interfaces/User";

export async function checkFriendStatus(userId: number) {
	const api = await Api.getInstance();
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
