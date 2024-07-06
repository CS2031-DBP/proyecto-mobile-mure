import { PaginatedResponse } from "@/interfaces/PaginationResponse";
import Api from "../api";
import { SongResponse } from "@/interfaces/Song";
import { AxiosRequestConfig } from "axios";

const api = new Api({});

export async function getSongs(page: number, size: number) {
	const options: AxiosRequestConfig = {
		url: `/songs/songs/all?page=${page}&size=${size}`,
	};

	try {
		const response = await api.get<null, PaginatedResponse<SongResponse>>(
			options
		);
		return response.data;
	} catch (error) {
		throw error;
	}
}
