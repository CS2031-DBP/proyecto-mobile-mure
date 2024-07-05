import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	RawAxiosRequestHeaders,
} from "axios";
import * as SecureStore from "expo-secure-store";

export default class Api {
	private basePath: string;
	private authorization: string;

	constructor(config: AxiosRequestConfig) {
		this.basePath = `$http://${process.env.BASE_PATH}:8080`;
		this.authorization = "";
	}

	private async request<RequestType, ResponseType>(
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			baseURL: this.basePath,
		};

		const path = this.basePath + options.url;

		const headers: RawAxiosRequestHeaders = {
			"Content-type": "application/json",
		};

		const noAuthRequired = ["/login", "/signin"];

		const requiresAuth = !noAuthRequired.some((endpoint) =>
			path.includes(endpoint)
		);

		if (requiresAuth) {
			const token = await SecureStore.getItemAsync("token");

			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}
		}

		const config: AxiosRequestConfig = {
			...configOptions,
			headers: headers,
		};

		console.log(config);

		return axios<RequestType, AxiosResponse<ResponseType>>(path, config);
	}

	public get<RequestType, ResponseType>(options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "get",
		};

		return this.request<RequestType, ResponseType>(configOptions);
	}

	public post<RequestType, ResponseType>(
		data: RequestType,
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "post",
			data: JSON.stringify(data),
		};

		return this.request<RequestType, ResponseType>(configOptions);
	}

	public patch<RequestType, ResponseType>(
		data: RequestType,
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "patch",
			data: JSON.stringify(data),
		};

		return this.request<RequestType, ResponseType>(configOptions);
	}

	public put(data: any, options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "put",
			data: JSON.stringify(data),
		};

		return this.request(configOptions);
	}

	public delete(options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "delete",
		};

		return this.request(configOptions);
	}
}
