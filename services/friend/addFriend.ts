import { AxiosRequestConfig } from "axios";
import Api from "../api";
const api = new Api({});

export async function addFriend(userId: number) {
	const options: AxiosRequestConfig = {
		url: `/user/friends/add/${userId}`,
	};

	try {
		await api.patch<null, void>(null, options);
	} catch (error) {
		throw error;
	}
}
