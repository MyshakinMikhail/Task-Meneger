import { useState } from "react";
import { Link } from "react-router-dom";
import api from "./../../utils/api";
import SendMessageToResetPasswordForm from "./SendMessageToResetPasswordForm";

export default function SendMessageToResetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    async function sendMessage() {
        try {
            const response = await api.get("/reset-password/send-message", {
                params: { email: email },
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

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Забыли пароль?</h2>
                <SendMessageToResetPasswordForm
                    sendMessage={sendMessage}
                    email={email}
                    setEmail={setEmail}
                />
                {error && <p className="error">{error}</p>}
                <p>
                    <Link to="/login">Вернуться к входу</Link>
                </p>
            </div>
        </div>
    );
}
