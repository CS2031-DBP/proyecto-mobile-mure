import { File } from "@interfaces/File";

export interface UserUpdate {
	profileImage?: File;
	name?: string;
	password?: string;
	email?: string;
	nickname?: string;
}
