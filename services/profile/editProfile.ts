import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { UserUpdate } from "@/interfaces/User";

const api = new Api({});

export async function editProfile(data: UserUpdate) {
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
