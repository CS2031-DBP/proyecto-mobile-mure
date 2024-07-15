import * as SecureStore from "expo-secure-store";

export async function logout() {
	try {
		await SecureStore.deleteItemAsync("token");
	} catch (error) {
		throw error;
	}
}
