import Api from "@services/api";
import { PlaylistRequest } from "../interfaces/PlaylistRequest";

export async function createPlaylist(playlist: PlaylistRequest): Promise<void> {
	const api = await Api.getInstance();

	try {
		await api.post<PlaylistRequest[], void>([playlist], {
			url: "/playlist",
		});
	} catch (error) {
		throw new Error("Failed to create playlist");
	}
}
