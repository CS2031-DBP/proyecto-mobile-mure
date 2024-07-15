import { AxiosRequestConfig } from "axios";
import Api from "../../../shared/services/api";

export async function deleteSong(id: number) {
	const api = await Api.getInstance();
	const config: AxiosRequestConfig = {
		url: `/songs/${id}`,
	};

	try {
		await api.delete(config);
	} catch (error) {
		throw error;
	}
}
