import { AxiosRequestConfig } from "axios";
import Api from "../api";

export async function addFriend(userId: number) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: `/user/friends/add/${userId}`,
	};

	try {
		await api.patch<null, void>(null, options);
	} catch (error) {
		throw error;
	}
}
