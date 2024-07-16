export interface UserFriends {
	id: number;
	name: string;
	friendsNames: string[];
	friendsIds: number[];
}

export interface IsFriendResponse {
	isFriend: boolean;
}
