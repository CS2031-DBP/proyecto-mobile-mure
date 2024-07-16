import { UserPasswordVerificationRequest } from "../interfaces/UserPasswordVerificationRequest";
import Api from "../../../shared/services/api";

export async function verifyPassword(userId: number, password: string) {
	const api = await Api.getInstance();
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
