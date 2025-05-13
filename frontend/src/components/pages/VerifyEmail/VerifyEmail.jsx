import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./../../utils/api";

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);

                console.log("1)");
                if (response.status == 201) {
                    setStatus("success");
                    setMessage(response.data.message);
                }
            } catch (error) {
                if (error.response) {
                    setStatus("error");
                    setMessage(
                        error.response.data.detail || "Произошла ошибка"
                    );
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
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus("error");
            setMessage("Токен отсутствует");
        }
    }, [token]);

    return (
        <div className="container">
            <div className="authContainer">
                {status === "loading" && <p>Проверяем...</p>}
                {status === "success" && (
                    <div>
                        <h1>Успех!</h1>
                        <p>{message}</p>
                        <a href="/login">Перейти к входу</a>
                    </div>
                )}
                {status === "error" && (
                    <div>
                        <h1>Ошибка</h1>
                        <p>{message}</p>
                        <p>Обратитесь куда-нибудь, я не знаю куда)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
