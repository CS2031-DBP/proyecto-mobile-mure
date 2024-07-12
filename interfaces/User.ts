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

export interface ProfileInfoProps {
	user: UserResponse;
	isCurrentUser: boolean;
	isFriend: boolean;
	setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
	friends: UserResponse[];
	setFriends: React.Dispatch<React.SetStateAction<UserResponse[]>>;
}
