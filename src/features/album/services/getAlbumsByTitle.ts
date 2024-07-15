import { PaginatedResponse } from "@interfaces/PaginationResponse";
import Api from "@services/api";
import { AlbumResponse } from "../interfaces/AlbumResponse";

export async function getAlbumsBytitle(
	title: string,
	page: number,
	size: number
) {
	const api = await Api.getInstance();

	try {
		console.log(
			`Requesting albums with title: ${title}, page: ${page}, size: ${size}`
		);
		const response = await api.get<null, PaginatedResponse<AlbumResponse>>({
			url: `/album/title?title=${title}&page=${page}&size=${size}`,
		});
		return response.data;
	} catch (error) {
		console.error("Error in getAlbumsBytitle:", error);
		throw error;
	}
}
