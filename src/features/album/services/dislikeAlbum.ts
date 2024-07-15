import Api from "@services/api";

export async function dislikeAlbum(albumId: number): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.patch<null, void>(null, {
			url: `/album/dislike/${albumId}`,
		});
	} catch (error) {
		throw error;
	}
}
