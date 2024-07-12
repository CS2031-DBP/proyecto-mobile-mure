import Api from "../api";
import { AxiosRequestConfig } from "axios";
import { UserResponse } from "@/interfaces/User";

export async function getUserById(userId: number) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: `/user/${userId}`,
	};

	try {
		const response = await api.get<null, UserResponse>(options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
