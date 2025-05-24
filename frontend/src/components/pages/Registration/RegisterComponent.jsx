import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthServiсe from "../../API/AuthService";
import RegisterForm from "./RegisterFormComponent";

export default function Register() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMessageWasSend, setIsMessageWasSend] = useState(false);
    const regRef = useRef();

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        AuthServiсe.PostRegistration(
            form,
            setError,
            setIsLoading,
            setIsMessageWasSend
        );
        regRef.current?.blur();
    };

    async function sendMessageAgain() {
        AuthServiсe.PostRegistrationAgain(
            form,
            setError,
            setIsLoading,
            setIsMessageWasSend
        );
    }

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Регистрация</h2>
                <RegisterForm
                    regRef={regRef}
                    sendMessageAgain={sendMessageAgain}
                    handleSubmit={handleSubmit}
                    form={form}
                    setForm={setForm}
                    error={error}
                    isLoading={isLoading}
                    isMessageWasSend={isMessageWasSend}
                />
                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
}
