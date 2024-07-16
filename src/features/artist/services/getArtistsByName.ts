import { PaginatedResponse } from "@interfaces/PaginationResponse";
import Api from "@services/api";
import { ArtistResponse } from "../interfaces/ArtistResponse";

export async function getArtistsByName(
	title: string,
	page: number,
	size: number
) {
	const api = await Api.getInstance();

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
		console.error("Error in getArtistsByName:", error);
		throw error;
	}
}
