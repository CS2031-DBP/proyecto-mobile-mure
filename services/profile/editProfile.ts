import { AxiosRequestConfig } from "axios";
import Api from "../api";
import { UserUpdateDto } from "@/interfaces/User";

const api = new Api({});

export async function editProfile(data: UserUpdateDto) {
	const options: AxiosRequestConfig = {
		url: "/user/update/me",
	};

	try {
		const response = await api.patch<UserUpdateDto, null>(data, options);
		return response;
	} catch (error) {
		throw error;
	}
}
