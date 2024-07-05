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
}
