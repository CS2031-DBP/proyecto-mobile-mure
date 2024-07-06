export interface UserUpdate {
	profileImage: string;
	name: string;
	password: string;
	email: string;
}

export interface UserResponse {
	id: number;
	name: string;
	birthDate: string;
	email: string;
	profileImage: string;
	role: string;
	friendsIds: number[];
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
