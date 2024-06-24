import Api from '../api';
import * as SecureStore from 'expo-secure-store';

const api = new Api({ });

export async function editProfile(data) {
    let options = {
        url: '/user/update/me',
    };

    return api.patch(data, options)
        .then(res => {
            if (res.data.token) {
                SecureStore.setItemAsync('token', res.data.token);
            }
            return res;
        })
        .catch(error => {
            return error;
        });
}