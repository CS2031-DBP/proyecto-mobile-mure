import Api from '../api';

const api = new Api({});

export async function verifyPassword(userId: number, password: string) {
    const options = {
        url: '/auth/verify-password',
    };

    const data = { userId, password };

    try {
        const res = await api.post<typeof data, boolean>(data, options);
        return res.data;
    } catch (error) {
        throw error;
    }
}
