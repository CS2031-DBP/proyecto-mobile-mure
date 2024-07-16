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
