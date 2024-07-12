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
		this.basePath = `http://${process.env.EXPO_PUBLIC_BASE_PATH}:8080`;
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
			// "Content-type": "application/json",
			"Content-Type":
				configOptions.headers?.["Content-Type"] || "application/json",
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

		return axios<RequestType, AxiosResponse<ResponseType>>(path, config);
	}

	public get<RequestBodyType, ResponseBodyType>(options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "get",
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public post<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "post",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public async postForm<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig
	) {
		const token = await SecureStore.getItemAsync("token");

		const configOptions: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			},
		};

		console.log(token);
		console.log(`${this.basePath}/post`);
		return axios.post(`${this.basePath}/post`, data, configOptions);

		// return this.post<RequestBodyType, ResponseBodyType>(
		// 	data,
		// 	configOptions
		// );
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "patch",
			data: JSON.stringify(data),
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
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
