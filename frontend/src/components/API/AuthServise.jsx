import useAuthStore from "../../hooks/useAuthStore";
import api from "../utils/api";

export default class AuthServiсe {
    static async PostRegistration(form, setError, setIsLoading) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", {
                email: form.email,
                password: form.password,
                username: form.username,
            });

            if (response.status === 201) {
                alert("Подтвердите Вашу почту");
            }
            console.log("Регистрация пройдена успешно");
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                    case 422:
                        setError(error.response.data.detail);
                        break;
                    case 500:
                        setError("Ошибка на сервере. Попробуйте позже.");
                        break;
                    default:
                        setError("Произошла ошибка. Попробуйте еще раз.");
                }
            } else {
                setError("Не удалось подключиться к серверу.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    static async PostLogin(form, setError, setIsLoading, navigate) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", {
                email: form.email,
                password: form.password,
            });

            if (response.status === 200) {
                const login = useAuthStore.getState().login;

                console.log("Токен получен с backend");

                login(response.data.access_token);

                navigate("/main");

                console.log("Авторизация прошла успешно");
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                    case 404:
                    case 422:
                        setError(error.response.data.detail);
                        break;
                    case 500:
                        setError("Ошибка на сервере. Попробуйте позже. ");
                        break;
                    default:
                        setError("Поизошла ошибка. Попробуйте еще раз.");
                }
            } else {
                setError("Не удалось подключиться к серверу.");
            }
        } finally {
            setIsLoading(false);
        }
    }
}
