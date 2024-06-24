import axios from "axios";
import * as SecureStore from "expo-secure-store";

class Api {
    constructor(config) {
        this.basePath = "http://192.168.50.37:8080"; // Asegúrate de que esta es tu basePath
    }

    async request(options) {
        let configOptions = {
            ...options,
            baseUrl: this.basePath,
        };

        let path = this.basePath + options.url;

        let headers = {
            "Content-type": "application/json",
        };

        const noAuthRequired = ["/login", "/signin"];

        const requiresAuth = !noAuthRequired.some(endpoint => path.includes(endpoint));

        if (requiresAuth) {
            const token = SecureStore.getItemAsync("token");
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
        }

        let config = {
            ...configOptions,
            headers: headers,
        };

        console.log(config);
        return axios(path, config);
    }

    get(options) {
        let configOptions = {
            ...options,
            method: "get",
        };

        return this.request(configOptions);
    }

    post(data, options) {
        let configOptions = {
            ...options,
            method: "post",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    patch(data, options) {
        let configOptions = {
            ...options,
            method: "patch",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    put(data, options) {
        let configOptions = {
            ...options,
            method: "put",
            data: JSON.stringify(data),
        };

        return this.request(configOptions);
    }

    delete(options) {
        let configOptions = {
            ...options,
            method: "delete",
        };

        return this.request(configOptions);
    }
}

export default Api;
