import Api from "../api";
import { SongResponse } from "@/interfaces/Song";

const api = new Api({});

export async function getSongsByTitle(
	title: string,
	page: number,
	size: number
) {
	try {
		const response = await api.get<null, SongResponse[]>({
			url: `/songs/title?title=${title}&page=${page}&size=${size}`,
		});
		console.log("API response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error in getSongsByTitle:", error);
		throw error;
	}
}
