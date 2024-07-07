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

export interface ProfileInfoProps {
    user: UserResponse;
    isCurrentUser: boolean;
    isFriend: boolean;
    setIsFriend: React.Dispatch<React.SetStateAction<boolean>>;
    friends: UserResponse[];
    setFriends: React.Dispatch<React.SetStateAction<UserResponse[]>>;
}