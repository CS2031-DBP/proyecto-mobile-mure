import { File } from "@interfaces/File";

export interface UpdatePlaylistRequest {
	id: number;
	name?: string;
	coverImage?: File;
}
