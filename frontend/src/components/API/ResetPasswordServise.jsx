import api from "./../utils/api";

export default class ResetPasswordServise {
    static async PostResetPassword(token, form, setError, navigate) {
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (!token) {
            setError(
                "Ссылка для восстановления недействительна или устарела. Попробуйте запросить новую."
            );
            return;
        }

        try {
            const response = await api.post(
                `/reset-password/change-password/${token}`,
                { password: form.password }
            );

            if (response.status === 200) {
                alert("Пароль успешно изменен");
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 404:
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
        }
    }

    static async SendMessageToResetPassword(email, setError) {
        setError("");

        try {
            const response = await api.post("/reset-password/send-message", {
                email: email,
            });

            if (response.status == 200) {
                alert("Письмо для восстановления отправлено на почту");
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 404:
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
        }
    }
}
