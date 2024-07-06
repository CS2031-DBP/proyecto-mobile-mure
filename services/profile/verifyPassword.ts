import { UserPasswordVerificationRequest } from "@/interfaces/Auth";
import Api from "../api";

const api = new Api({});

export async function verifyPassword(userId: number, password: string) {
	const options = {
		url: "/auth/verify-password",
	};

	try {
		const response = await api.post<
			UserPasswordVerificationRequest,
			boolean
		>({ userId, password }, options);
		return response.data;
	} catch (error) {
		throw error;
	}
}
