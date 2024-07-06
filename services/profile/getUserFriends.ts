import { getUserById } from "./getUserById";

export async function getUserFriends(friendIds: number[]) {
	const promises = friendIds.map((id) => getUserById(id));

	try {
		const response = await Promise.all(promises);
		return response.map((res) => res);
	} catch (error) {
		throw error;
	}
}
