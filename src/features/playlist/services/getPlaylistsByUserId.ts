import { PaginatedResponse } from "@interfaces/PaginationResponse";
import Api from "@services/api";
import { PlaylistResponse } from "../interfaces/PlaylistResponse";

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
