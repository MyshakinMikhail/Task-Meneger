import useAuthStore from "../../hooks/useAuthStore";
import api from "../utils/api";

export default class AuthServiсe {
    static async PostRegistration(
        form,
        setError,
        setIsLoading,
        setIsMessageWasSend
    ) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", {
                email: form.email,
                password: form.password,
                username: form.username,
            });

            if (response.status === 200) {
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
            setIsMessageWasSend(true);
        }
    }

    static async PostRegistrationAgain(
        form,
        setError,
        setIsLoading,
        setIsMessageWasSend
    ) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/resend-email", {
                email: form.email,
            });

            if (response.status === 200) {
                alert("Ссылка на подтверждение отправлена на почту");
                setIsMessageWasSend(true);
            }
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

    static async VerifyEmail(token, setStatus, setMessage) {
        setMessage("");

        try {
            const response = await api.get(`/auth/verify-email/${token}`);

            if (response.status == 200) {
                setStatus("success");
                setMessage(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                setStatus("error");
                setMessage(error.response.data.detail || "Произошла ошибка");
                switch (error.response.status) {
                    case 409:
                    case 422:
                        setMessage(error.response.data.detail);
                        break;
                    case 500:
                        setMessage("Ошибка на сервере. Попробуйте позже.");
                        break;
                    default:
                        setMessage("Произошла ошибка. Попробуйте еще раз.");
                }
            } else {
                setMessage("Не удалось подключиться к серверу.");
            }
        }
    }
}
