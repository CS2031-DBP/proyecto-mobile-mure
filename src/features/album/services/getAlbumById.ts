import { AlbumResponse } from "../interfaces/AlbumResponse";
import Api from "@services/api";

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
