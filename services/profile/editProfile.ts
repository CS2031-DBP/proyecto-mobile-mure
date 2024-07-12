import Api from "../api";
import { UserUpdate } from "@/interfaces/User";

export async function editProfile(data: UserUpdate) {
	const api = await Api.getInstance();

	try {
		await api.patchForm<UserUpdate, void>(data, {
			url: "/user/update/me",
		});
	} catch (error) {
		throw error;
	}
}
