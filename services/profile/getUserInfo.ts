import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { UserResponse } from "@/interfaces/User";

const api = new Api({});

export async function getCurrentUserInfo() {
	const options: AxiosRequestConfig = {
		url: "/user/me",
	};

	try {
		const response = await api.get<null, UserResponse>(options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
