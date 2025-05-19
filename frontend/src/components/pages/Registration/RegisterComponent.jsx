import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthServiсe from "../../API/AuthServise";
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
    const regRef = useRef();

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        AuthServiсe.PostRegistration(form, setError, setIsLoading);
        regRef.current?.blur();
    };

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Регистрация</h2>
                <RegisterForm
                    regRef={regRef}
                    handleSubmit={handleSubmit}
                    form={form}
                    setForm={setForm}
                    error={error}
                    isLoading={isLoading}
                />
                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
}
