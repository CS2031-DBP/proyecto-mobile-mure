import Api from "../api";
import * as SecureStore from "expo-secure-store";

const api = new Api({});

export async function login(user) {
    let options = {
        url: "/auth/login",
    };

    try {
        const res = await api.post(user, options);
        await SecureStore.setItemAsync("token", res.data.token);
        return res;
    } catch (error) {
        return error;
    }
}

export async function register(user) {
    let options = {
        url: "/auth/signin",
    };

    try {
        const res = await api.post(user, options);
        await SecureStore.setItemAsync("token", res.data.token);
        return res;
    } catch (error) {
        return error;
    }
}

export async function logout() {
    try {
        await SecureStore.deleteItemAsync("token");
    } catch (error) {
        return error;
    }
}
