import { useState } from "react";
import { Link } from "react-router-dom";
import ResetPasswordServise from "../../API/ResetPasswordServise";
import SendMessageToResetPasswordForm from "./SendMessageToResetPasswordForm";

export default function SendMessageToResetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    async function sendMessage(email) {
        ResetPasswordServise.SendMessageToResetPassword(email, setError);
    }

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Забыли пароль?</h2>
                <SendMessageToResetPasswordForm
                    error={error}
                    sendMessage={sendMessage}
                    email={email}
                    setEmail={setEmail}
                />
                <p>
                    <Link to="/login">Вернуться к входу</Link>
                </p>
            </div>
        </div>
    );
}
