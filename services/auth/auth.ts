import Api from "../api";
import * as SecureStore from "expo-secure-store";
import { AxiosRequestConfig } from "axios";
import { LoginDto, LoginResponse } from "interfaces/Login";
import { SignupDto, SignupResponse } from "interfaces/Signup";

const api = new Api({});

export async function login(loginDto: LoginDto) {
	const options: AxiosRequestConfig = {
		url: "/auth/login",
	};

	try {
		const response = await api.post<LoginDto, LoginResponse>(
			loginDto,
			options
		);
		await SecureStore.setItemAsync("token", response.data.token);
		return response;
	} catch (error) {
		throw error;
	}
}

export async function register(signupDto: SignupDto) {
	const options: AxiosRequestConfig = {
		url: "/auth/signin",
	};

	try {
		const response = await api.post<SignupDto, SignupResponse>(
			signupDto,
			options
		);
		await SecureStore.setItemAsync("token", response.data.token);
		return response;
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
