import { PlaylistResponse } from "@/interfaces/Playlist";
import Api from "../api";

export async function getPlaylistById(id: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, PlaylistResponse>({
			url: `/playlist/${id}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
