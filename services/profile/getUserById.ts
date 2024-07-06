import Api from "../api";
import { AxiosRequestConfig } from "axios";
import { UserResponse } from "@/interfaces/User";

const api = new Api({});

export async function getUserById(userId: number) {
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
