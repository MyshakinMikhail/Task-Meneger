import api from "../utils/api";

export default class PostServiсe {
    static async PostRegistration(form, setError, setIsLoading) {
        setIsLoading(true);
        setError("");
    
        try {
            const response = await api.post(
                "/api/v1/users/signup",
                {
                    email: form.email,
                    password: form.password,
                    username: form.username,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                alert("Подтвердите Вашу почту");
            }
            // navigate("/login");
            console.log("Регистрация пройдена успешно");
        } catch (error) {
            // обработка ошибок 400, 409, 422 ( ошибка валидации пароля ), 500.
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError(
                            "Некорректный email. Проверьте введенные данные."
                        );
                        break;
                    case 409:
                        setError("Пользователь с таким email уже существует.");
                        break;
                        case 422:
                            const detail = error.response.data.detail;
                            if (detail && Array.isArray(detail)) {
                                const usernameError = detail.find(
                                    (err) => err.loc && err.loc.includes("username") && err.type === "string_too_short"
                                );
                                if (usernameError) {
                                    setError("Имя пользователя должно содержать не менее 3 символов.");
                                    break;
                                }
                            }
                            setError("Ошибка валидации: Проверьте введенные данные.");
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
}
