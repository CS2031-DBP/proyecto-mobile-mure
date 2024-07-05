import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { UserResponse } from "@/interfaces/User";

const api = new Api({});

export async function fetchCurrentUser() {
	const options: AxiosRequestConfig = {
		url: "/user/me",
	};

	try {
		const response = await api.get<null, UserResponse>(options);
		return response;
	} catch (error) {
		throw error;
	}
}
