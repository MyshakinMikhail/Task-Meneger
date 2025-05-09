import api from "../utils/api";
import useAuthStore from "./../../hooks/useAuthStore";

export default class PostServiсe {
    static async PostRegistration(form, setError, setIsLoading) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/api/auth/register", {
                email: form.email,
                password: form.password,
                username: form.username,
            });

            if (response.status === 201) {
                alert("Подтвердите Вашу почту");
            }
            // navigate("/login");
            console.log("Регистрация пройдена успешно");
        } catch (error) {
            // обработка ошибок 400, 409, 422 ( ошибка валидации пароля ), 500.
            if (error.response) {
                switch (error.response.status) {
                    case 409:
                        setError(`${error.response.data.detail}`);
                        break;
                    case 422:
                        setError(
                            "Ошибка валидации: " + error.response.data.detail
                        );
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
            const response = await api.post("/api/auth/login", {
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
                        setError("Ошибка: " + error.response.data.detail);
                        break;
                    case 404:
                        setError("Ошибка: " + error.response.data.detail);
                        break;
                    case 422:
                        setError(
                            "Ошибка валидации: " + error.response.data.detail
                        );
                        break;
                    case 500:
                        setError(
                            "Ошибка на сервере. Попробуйте позже. " +
                                error.response.data.detail
                        );
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
