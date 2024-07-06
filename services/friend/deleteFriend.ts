import { AxiosRequestConfig } from "axios";
import Api from "../api";
const api = new Api({});

export async function deleteFriend(userId: number) {
	const options: AxiosRequestConfig = {
		url: `/user/friends/remove/${userId}`,
	};

	try {
		await api.patch<null, void>(null, options);
	} catch (error) {
		throw error;
	}
}
