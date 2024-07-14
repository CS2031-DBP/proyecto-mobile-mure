import { File } from "./File";

export interface PlaylistResponse {
	id: number;
	name: string;
	userId: number;
	nickname: string;
	songsIds: number[];
	coverImageUrl: string;
}

export interface PlaylistRequest {
	name: string;
	userId: number;
	songsIds: number[];
	coverImage?: File;
}

export interface UpdatePlaylistRequest {
	id: number;
	name?: string;
	coverImage?: File;
}
