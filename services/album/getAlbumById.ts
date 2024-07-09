import { AlbumResponse } from "@/interfaces/Album";
import Api from "../api";

const api = new Api({});

export async function getAlbumById(id: number) {
	try {
		const response = await api.get<null, AlbumResponse>({
			url: `/album/${id}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
