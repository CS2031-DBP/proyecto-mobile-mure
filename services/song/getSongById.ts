// src/services/song/getSongById.ts
import Api from "../api";
import { SongResponse } from "@/interfaces/Song";

export async function getSongById(songId: number) {
	const api = await Api.getInstance();

	try {
		const response = await api.get<null, SongResponse>({
			url: `/songs/${songId}`,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
}
