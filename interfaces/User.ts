import { File } from "./File";

export interface UserUpdate {
	profileImage?: File;
	name?: string;
	password?: string;
	email?: string;
	nickname?: string;
}

export interface UserResponse {
	id: number;
	name: string;
	birthDate: string;
	email: string;
	profileImageUrl: string;
	role: string;
	friendsIds: number[];
	nickname: string;
}

export interface UserFriends {
	id: number;
	name: string;
	friendsNames: string[];
	friendsIds: number[];
}

export interface IsFriendResponse {
	isFriend: boolean;
}
