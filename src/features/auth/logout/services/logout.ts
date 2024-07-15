import Api from "@services/api";
import * as SecureStore from "expo-secure-store";

export async function logout() {
	const api = await Api.getInstance();
	try {
		await SecureStore.deleteItemAsync("token");
		api.setAuthorization("");
	} catch (error) {
		throw error;
	}
}
