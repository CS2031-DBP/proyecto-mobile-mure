import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import Api from "../api";
import { SongResponse } from "@/interfaces/Song";

const api = new Api({});

export async function getSongs(page: number, size: number) {
	const options = {
		url: `/songs/songs/all?page=${page}&size=${size}`,
	};

	try {
		const response = await api.get<null, PaginatedResponse<SongResponse>>(
			options
		);
		return response;
	} catch (error) {
		throw error;
	}
}
