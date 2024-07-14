import Api from "../api";
import { UpdatePlaylistRequest } from "@/interfaces/Playlist";

export async function updatePlaylist(data: UpdatePlaylistRequest) {
	const api = await Api.getInstance();

	try {
		await api.patchForm<UpdatePlaylistRequest, void>(data, {
			url: "/playlist",
		});
	} catch (error) {
		throw error;
	}
}
