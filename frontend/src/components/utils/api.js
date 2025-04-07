import axios from "axios";

const API_URL = import.meta.env.API_URL;

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
    baseURL: API_URL, // Базоывый URL-адрес, по которому идет обращение к серверу. Он добавляется в каждый API запрос
    withCredentials: true, // Для автоматического отправления cookie файлов на сервер и получения с сервера
    headers: {
        "Content-Type": "application/json",
    }, // отправляемые данные с frontend имеют тип json
});

// Добавляем перехватчик запросов для автоматического добавления токена для main страницы
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Добавляем перехватчик ответов для обработки ошибок для main страницы
api.interceptors.response.use(
    (response) => response,
    async (error) => { // мы попадаем сюда, если наш access токен истек   
        // Обработка ошибки 401 (Unauthorized) - можно добавить логику обновления токена
        if (error.response && error.response.status === 401) {
            // Здесь можно добавить логику обновления токена через refresh token
            // Пример: await refreshToken();

            // Пока просто очищаем токен и перенаправляем на логин
            localStorage.removeItem("accessToken");
        }

        return Promise.reject(error);
    }
);

export default api;
