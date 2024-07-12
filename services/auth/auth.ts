import Api from "../api";
import * as SecureStore from "expo-secure-store";
import { AxiosRequestConfig } from "axios";
import {
	LoginRequest,
	LoginResponse,
	SignupRequest,
	SignupResponse,
} from "interfaces/Auth";

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

export async function logout() {
	try {
		await SecureStore.deleteItemAsync("token");
	} catch (error) {
		throw error;
	}
}
