import { AxiosRequestConfig } from "axios";
import Api from "../api";

const api = new Api({});

export async function deleteSong(id: number) {
	const config: AxiosRequestConfig = {
		url: `/songs/${id}`,
	};

	try {
		await api.delete(config);
	} catch (error) {
		throw error;
	}
}
