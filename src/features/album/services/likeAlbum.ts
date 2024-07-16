import Api from "@services/api";

export async function likeAlbum(albumId: number): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.patch<null, void>(null, {
			url: `/album/like/${albumId}`,
		});
	} catch (error) {
		throw error;
	}
}
