import Api from "../api";
import { SongResponse } from "@/interfaces/Song";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";

const api = new Api({});

export async function getSongsByTitle(
	title: string,
	page: number,
	size: number
) {
	try {
		console.log(
			`Requesting songs with title: ${title}, page: ${page}, size: ${size}`
		);
		const response = await api.get<null, PaginatedResponse<SongResponse>>({
			url: `/songs/title?title=${title}&page=${page}&size=${size}`,
		});
		return response.data;
	} catch (error) {
		console.error("Error in getSongsByTitle:", error);
		throw error;
	}
}
