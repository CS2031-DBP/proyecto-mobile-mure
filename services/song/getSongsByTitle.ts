import Api from "../api";
import { SongResponse } from "@/interfaces/Song";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";

export async function getSongsByTitle(
	title: string,
	page: number,
	size: number
) {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, PaginatedResponse<SongResponse>>({
			url: `/songs/title?title=${title}&page=${page}&size=${size}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
