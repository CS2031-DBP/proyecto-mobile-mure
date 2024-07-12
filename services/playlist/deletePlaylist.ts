import Api from "../api";

export async function deletePlaylist(playlistId: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.delete({
			url: `/playlist/${playlistId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
