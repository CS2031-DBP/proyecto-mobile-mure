import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import Api from "../api";
import { AlbumResponse } from "@/interfaces/Album";

const api = new Api({});

export async function getAlbumsBytitle(
	title: string,
	page: number,
	size: number
) {
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