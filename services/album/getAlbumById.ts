import { AlbumResponse } from "@/interfaces/Album";
import Api from "../api";

export async function getAlbumById(id: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, AlbumResponse>({
			url: `/album/${id}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
