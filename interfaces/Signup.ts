export interface SignupDto {
	email: string;
	password: string;
	name: string;
	birthdate: string;
}

export interface SignupResponse {
	token: string;
}