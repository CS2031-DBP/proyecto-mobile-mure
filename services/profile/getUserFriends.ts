import { fetchUserById } from './getUserById';
import { UserResponse } from '@/interfaces/User';

export async function fetchUserFriends(friendIds: number[]): Promise<UserResponse[]> {
    const promises = friendIds.map(id => fetchUserById(id));

    try {
        const friendsData = await Promise.all(promises);
        return friendsData;
    } catch (error) {
        throw error;
    }
}
