import Api from "../../../shared/services/api";
import { PlaylistResponse } from "@/interfaces/Playlist";
import { PaginatedResponse } from "@/interfaces/PaginationResponse";

export async function getPlaylistsByUserId(
	userId: number,
	page: number,
	size: number
) {
	const api = await Api.getInstance();
	const options = {
		url: `/playlist/user/${userId}?page=${page}&size=${size}`,
	};

	try {
		const response = await api.get<
			null,
			PaginatedResponse<PlaylistResponse>
		>(options);
		return response.data.content;
	} catch (error) {
		throw error;
	}
}
