import Api from "../api";
import { AxiosRequestConfig } from "axios";

const api = new Api({});

export async function deleteUserById(userId: number) {
	const options: AxiosRequestConfig = {
		url: `/user/${userId}`,
	};

	try {
		const response = await api.delete(options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
