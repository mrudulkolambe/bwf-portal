import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from "axios";
import { getToken, clearToken } from "./token";

export interface BaseAPIResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

interface APIError {
    success: false;
    message: string;
    status?: number;
    data: null;
}

type RequestParams = Record<string, any>;
type RequestBody = Record<string, any> | any[];

class API {
    private static instance: AxiosInstance;
    private static pendingRequests = new Map<string, Promise<any>>();

    private static getInstance(): AxiosInstance {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: '', // Using relative URLs for Next.js API routes
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            this.instance.interceptors.request.use(
                (config) => {
                    const token = getToken();
                    if (token && !config.headers.Authorization) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            this.instance.interceptors.response.use(
                (response) => response,
                (error) => {
                    if (error.response?.status === 401) {
                        if (typeof window !== 'undefined') {
                            clearToken();
                            window.location.href = '/';
                        }
                    }
                    return Promise.reject(error);
                }
            );
        }
        return this.instance;
    }

    private static handleError(error: unknown): APIError {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            return {
                success: false,
                message: axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message || 'An error occurred',
                status: axiosError.response?.status,
                data: null,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            data: null,
        };
    }

    private static getRequestKey(url: string, params?: RequestParams): string {
        return `GET:${url}:${JSON.stringify(params || {})}`;
    }

    static async get<T = any>(url: string, params?: RequestParams, headers?: Record<string, string>): Promise<BaseAPIResponse<T>> {
        const cacheKey = this.getRequestKey(url, params);

        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }

        const requestPromise = (async () => {
            try {
                const instance = this.getInstance();
                const response = await instance.get<T>(url, { params, headers });
                return {
                    success: true,
                    message: "success",
                    data: response.data
                };
            } catch (error) {
                return this.handleError(error) as any;
            } finally {
                setTimeout(() => {
                    this.pendingRequests.delete(cacheKey);
                }, 500);
            }
        })();

        this.pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
    }

    static async post<T = any>(url: string, data?: RequestBody, params?: RequestParams, headers?: Record<string, string>): Promise<BaseAPIResponse<T>> {
        try {
            const instance = this.getInstance();
            const response = await instance.post<T>(url, data, { params, headers });
            return {
                success: true,
                message: "success",
                data: response.data
            };
        } catch (error) {
            return this.handleError(error) as any;
        }
    }

    static async put<T = any>(url: string, data?: RequestBody, params?: RequestParams, headers?: Record<string, string>): Promise<BaseAPIResponse<T>> {
        try {
            const instance = this.getInstance();
            const response = await instance.put<T>(url, data, { params, headers });
            return {
                success: true,
                message: "success",
                data: response.data
            };
        } catch (error) {
            return this.handleError(error) as any;
        }
    }

    static async delete<T = any>(url: string, data?: RequestBody, params?: RequestParams, headers?: Record<string, string>): Promise<BaseAPIResponse<T>> {
        try {
            const instance = this.getInstance();
            const config: AxiosRequestConfig = { params, headers };
            if (data) {
                config.data = data;
            }
            const response = await instance.delete<T>(url, config);
            return {
                success: true,
                message: "success",
                data: response.data
            };
        } catch (error) {
            return this.handleError(error) as any;
        }
    }
}

export default API;
