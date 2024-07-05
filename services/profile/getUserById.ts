import Api from '../api';
import { AxiosRequestConfig } from 'axios';
import { UserResponse } from '@/interfaces/User';

const api = new Api({});

export async function fetchUserById(userId: number): Promise<UserResponse> {
    const options: AxiosRequestConfig = {
        url: `/user/${userId}`,
    };

    try {
        const res = await api.get<null, { data: UserResponse }>(options);
        return res.data;
    } catch (error) {
        throw error;
    }
}
