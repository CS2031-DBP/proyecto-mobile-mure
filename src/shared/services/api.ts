import createFormData from "@utils/createFormData";
import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	RawAxiosRequestHeaders,
} from "axios";

export default class Api {
	private static instance: Api | null = null;
	private basePath: string;
	private authorization: string | null;

	private constructor(basePath: string, authorization: string | null) {
		this.basePath = basePath;
		this.authorization = authorization;
	}

	public setAuthorization(authorization: string) {
		this.authorization = authorization;
	}

	public static async getInstance() {
		if (!Api.instance) {
			const basePath = `http://${process.env.EXPO_PUBLIC_BASE_PATH}:8080`;
			Api.instance = new Api(basePath, "");
		}

		return Api.instance;
	}

	private async request<RequestType, ResponseType>(
		options: AxiosRequestConfig
	) {
		const headers: RawAxiosRequestHeaders = {
			"Content-Type":
				options.headers?.["Content-Type"] || "application/json",
			Authorization: this.authorization
				? `Bearer ${this.authorization}`
				: "",
		};
		const configOptions: AxiosRequestConfig = {
			...options,
			baseURL: this.basePath,
			headers: headers,
		};
		const path = this.basePath + options.url;

		return axios<RequestType, AxiosResponse<ResponseType>>(
			path,
			configOptions
		);
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

	public async postForm<
		RequestBodyType extends Record<string, any>,
		ResponseBodyType,
	>(data: RequestBodyType, options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		const formData = createFormData(data);

		return this.post<object, ResponseBodyType>(formData, configOptions);
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig
	) {
		const configOptions: AxiosRequestConfig = {
			...options,
			method: "patch",
			data: data,
		};

		return this.request<RequestBodyType, ResponseBodyType>(configOptions);
	}

	public async patchForm<
		RequestBodyType extends Record<string, any>,
		ResponseBodyType,
	>(data: RequestBodyType, options: AxiosRequestConfig) {
		const configOptions: AxiosRequestConfig = {
			...options,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		const formData = createFormData(data);

		return this.patch<object, ResponseBodyType>(formData, configOptions);
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
