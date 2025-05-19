import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthServiсe from "../../API/AuthServise";
import LoginFormComponent from "./LoginFormComponent";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (form.email && form.password) {
            AuthServiсe.PostLogin(form, setError, setIsLoading, navigate);
        }
    };

    return (
        <>
            <div className="container">
                <div className="authContainer">
                    <h2>Вход</h2>
                    <LoginFormComponent
                        handleSubmit={handleSubmit}
                        form={form}
                        setForm={setForm}
                        error={error}
                        isLoading={isLoading}
                    />
                    <p>
                        Нет аккаунта?{" "}
                        <Link to="/register">Зарегистрируйтесь</Link>
                    </p>
                    <p>
                        <Link to="/reset-password/email">Забыли пароль?</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
