import Api from "@services/api";

export async function isAlbumLikedByUser(
	albumId: number,
	userId: number
): Promise<boolean> {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, boolean>({
			url: `/album/liked/${albumId}/${userId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
