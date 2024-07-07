import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";

interface CustomJwtPayload {
    role: string;
}

function isCustomJwtPayload(object: any): object is CustomJwtPayload {
    return "role" in object;
}

export async function getRoleFromToken() {
    const token = await SecureStore.getItemAsync("token");

    if (!token) throw new Error("No token found");

    try {
        const decodedToken = jwtDecode(token);

        if (isCustomJwtPayload(decodedToken)) {
            console.log('Decoded role from token:', decodedToken.role);
            return decodedToken.role;
        } else {
            throw new Error("Invalid token payload");
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        throw new Error("Invalid token format");
    }
}
