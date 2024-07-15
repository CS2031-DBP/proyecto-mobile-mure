import Api from "../../../shared/services/api";

export async function isSongLikedByUser(
	songId: number,
	userId: number
): Promise<boolean> {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, boolean>({
			url: `/songs/liked/${songId}/${userId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
