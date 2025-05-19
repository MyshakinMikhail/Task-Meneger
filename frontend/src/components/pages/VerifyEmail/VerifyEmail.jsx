import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthServiсe from "../../API/AuthService";

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            AuthServiсe.VerifyEmail(token, setStatus, setMessage);
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
