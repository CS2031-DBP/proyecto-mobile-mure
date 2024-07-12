import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { UserUpdate } from "@/interfaces/User";

export async function editProfile(data: UserUpdate) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: "/user/update/me",
	};

	try {
		const response = await api.patch<UserUpdate, null>(data, options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
