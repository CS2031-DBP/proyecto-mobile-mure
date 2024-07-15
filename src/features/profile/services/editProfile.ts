import Api from "@services/api";
import { UserUpdate } from "../interfaces/UserUpdate";

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
