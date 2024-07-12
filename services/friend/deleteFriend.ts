import { AxiosRequestConfig } from "axios";
import Api from "../api";

export async function deleteFriend(userId: number) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: `/user/friends/remove/${userId}`,
	};

	try {
		await api.patch<null, void>(null, options);
	} catch (error) {
		throw error;
	}
}
