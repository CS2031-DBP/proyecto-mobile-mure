import Api from "../../../shared/services/api";

export async function removeSongFromPlaylist(
	playlistId: number,
	songId: number
) {
	const api = await Api.getInstance();

	try {
		const response = await api.patch<null, void>(null, {
			url: `/playlist/${playlistId}/removeSong/${songId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
