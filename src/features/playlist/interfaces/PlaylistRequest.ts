import { File } from "@interfaces/File";

export interface PlaylistRequest {
	name: string;
	userId: number;
	songsIds: number[];
	coverImage?: File;
}
