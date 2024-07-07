import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import Api from "../api";
import { ArtistResponse } from "@/interfaces/Artist";

const api = new Api({});

export async function getArtistsByName(
	title: string,
	page: number,
	size: number
) {
	try {
		console.log(
			`Requesting artists with title: ${title}, page: ${page}, size: ${size}`
		);
		const response = await api.get<null, PaginatedResponse<ArtistResponse>>(
			{
				url: `/artist/name?name=${title}&page=${page}&size=${size}`,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error in getAlbumsBytitle:", error);
		throw error;
	}
}
