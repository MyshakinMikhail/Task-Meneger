import axios from "axios";
import useAuthStore from "./../../hooks/useAuthStore";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token =
            useAuthStore.getState().accessToken ||
            localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.log("Поймали ошибку при добавлении токена в url", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            // error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            console.log(
                "Перехвачена ошибка с бэкенда: " + error.response.data.detail
            );
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post("/auth/refresh", {});
                const newAccessToken = refreshResponse.data.access_token;
                localStorage.setItem("access", newAccessToken);
                useAuthStore.getState().login(newAccessToken);

                api.defaults.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error(
                    "Не удалось обновить access токен: " +
                        (refreshError.response?.data?.detail ||
                            refreshError.message)
                );
                throw refreshError;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
