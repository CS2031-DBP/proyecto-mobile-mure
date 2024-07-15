import { File } from "@interfaces/File";

export interface PostRequest {
	userId: number;
	songId?: number;
	albumId?: number;
	description: string;
	image?: File;
	audio?: File;
}
