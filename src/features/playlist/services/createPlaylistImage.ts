import Api from "../../../shared/services/api";
import { PlaylistRequest } from "@/interfaces/Playlist";

export async function createPlaylistImage(
	playlist: PlaylistRequest
): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.postForm<PlaylistRequest, void>(playlist, {
			url: "/playlist/image",
		});
	} catch (error) {
		throw new Error("Failed to create playlist");
	}
}
