import Api from "@services/api";
import { AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { SignupRequest } from "../interfaces/SignupRequest";
import { SignupResponse } from "../interfaces/SignupResponse";

export async function register(signupDto: SignupRequest) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: "/auth/signin",
	};

	try {
		const response = await api.post<SignupRequest, SignupResponse>(
			signupDto,
			options
		);
		await SecureStore.setItemAsync("token", response.data.token);
		api.setAuthorization(response.data.token);
		return response.data;
	} catch (error) {
		throw error;
	}
}
