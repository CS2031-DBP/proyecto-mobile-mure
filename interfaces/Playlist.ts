export interface PlaylistResponse {
	id: number;
	name: string;
	userId: number;
	songsIds: number[];
}

export interface PlaylistRequest {
	name: string;
	userId: number;
	songsIds: number[];
}
