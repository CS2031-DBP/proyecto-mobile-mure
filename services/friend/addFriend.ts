import Api from "../api";
const api = new Api({});

export async function addFriend(userId: number): Promise<void> {
    const options = {
        url: `/user/friends/add/${userId}`,
    };

    try {
        await api.patch<null, void>(null, options);
    } catch (error) {
        throw error;
    }
}
