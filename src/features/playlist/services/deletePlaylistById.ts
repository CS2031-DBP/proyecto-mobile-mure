import Api from "@services/api";

export async function deletePlaylistById(playlistId: number) {
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
