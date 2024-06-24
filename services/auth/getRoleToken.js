import { jwtDecode } from 'jwt-decode';

export const getRoleBasedOnToken = async () => {
  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    throw new Error('Invalid token format');
  }
};


