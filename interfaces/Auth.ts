export interface SignupRequest {
	email: string;
	password: string;
	name: string;
	lastname: string;
	birthdate: Date;
	nickname: string;
}

export interface SignupResponse {
	token: string;
}

export interface LoginRequest {}

export interface LoginResponse {
	token: string;
}

export interface UserPasswordVerificationRequest {
	userId: number;
	password: string;
}
