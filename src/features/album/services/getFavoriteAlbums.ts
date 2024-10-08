import { AlbumResponse } from "../interfaces/AlbumResponse";
import Api from "@services/api";

export async function getFavoriteAlbums(
	userId: number
): Promise<AlbumResponse[]> {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, AlbumResponse[]>({
			url: `/user/favoriteAlbums/${userId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
