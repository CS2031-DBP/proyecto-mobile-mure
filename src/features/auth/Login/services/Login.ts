import Api from "@services/api";
import { LoginRequest } from "../interfaces/LoginRequest";
import { AxiosRequestConfig } from "axios";
import { LoginResponse } from "../interfaces/LoginResponse";
import * as SecureStore from "expo-secure-store";

export async function login(loginRequestDto: LoginRequest) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: "/auth/login",
	};

	try {
		const response = await api.post<LoginRequest, LoginResponse>(
			loginRequestDto,
			options
		);
		await SecureStore.setItemAsync("token", response.data.token);
		api.setAuthorization(response.data.token);
		return response.data;
	} catch (error) {
		throw error;
	}
}
