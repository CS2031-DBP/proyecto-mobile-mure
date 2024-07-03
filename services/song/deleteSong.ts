import Api from "../api";

const api = new Api({});

export function deleteSong(id: number) {
	return api.delete({ url: `/songs/${id}` });
}
