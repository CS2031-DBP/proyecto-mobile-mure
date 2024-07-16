import Api from "../../../shared/services/api";
import { AxiosRequestConfig } from "axios";

export async function deleteUserById(userId: number) {
	const api = await Api.getInstance();
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
