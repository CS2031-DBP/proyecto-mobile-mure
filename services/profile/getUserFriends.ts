import { UserForUserResponse } from "@/interfaces/User";
import Api from "../api";
import { AxiosRequestConfig } from "axios";

const api = new Api({});

export async function fetchUserFriends() {
	const options: AxiosRequestConfig = {
		url: "/user/friends/me",
	};

	try {
		const response = await api.get<null, UserForUserResponse>(options);
		return response;
	} catch (error) {
		throw error;
	}
}
