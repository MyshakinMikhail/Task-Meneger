import axios from "axios";

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
    // baseURL: VITE_API_URL -> Базоывый URL-адрес, по которому идет обращение к серверу. Он добавляется в каждый API запрос
    withCredentials: true, // Для автоматического отправления cookie файлов на сервер и получения с сервера
    headers: {
        "Content-Type": "application/json",
    }, // отправляемые данные с frontend имеют тип json
});

// Добавляем перехватчик запросов для автоматического добавления токена в url при любых запросах на бэк
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        //обработка других ошибок, пока что простая.
        console.log("Поймали ошибку при добавлении токена в url", error);
        return Promise.reject(error);
    }
);

// Добавляем перехватчик ответов для обработки ошибок для main страницы
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    "/api/refresh",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                const newAccessToken = refreshResponse.data.access_token;
                localStorage.setItem("access", newAccessToken);

                api.defaults.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Не удалось обновить access токен", refreshError);
                throw refreshError;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
