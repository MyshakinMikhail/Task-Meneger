import api from "../utils/api";

export default class PostServiсe {
    static async PostRegistration(form, setError, setIsLoading) {
        setIsLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/register", {
                email: form.email,
                password: form.password,
                userName: form.userName,
            });
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
}
