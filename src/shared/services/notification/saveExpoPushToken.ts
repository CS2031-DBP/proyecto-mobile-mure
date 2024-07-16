import { ExpoTokenRequest } from "@interfaces/ExpoTokenRequest";
import Api from "../api";
import { AxiosRequestConfig } from "axios";

export async function saveExpoPushToken(
	userId: number,
	expoTokenRequest: ExpoTokenRequest
) {
	const api = await Api.getInstance();
	const options: AxiosRequestConfig = {
		url: `/user/expo-token/${userId}`,
	};
	try {
		await api.post<ExpoTokenRequest, void>(expoTokenRequest, options);
		console.log("Token saved to backend");
	} catch (error) {
		console.error("Failed to save token to backend", error);
	}
}
