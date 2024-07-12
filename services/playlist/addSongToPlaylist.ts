import Api from "../api";

export async function addSongToPlaylist(playlistId: number, songId: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.patch<null, void>(null, {
			url: `/playlist/${playlistId}/addSong/${songId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
