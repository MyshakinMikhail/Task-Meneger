import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthServiсe from "../../API/AuthServise";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.email && form.password) {
            AuthServiсe.PostLogin(form, setError, setIsLoading, navigate);
        }
    };

    return (
        <>
            <div className="container">
                <div className="authContainer">
                    <h2>Вход</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                            className="input"
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" className="button">
                            {isLoading ? "Вход..." : "Войти"}
                        </button>
                    </form>
                    <p>
                        Нет аккаунта?{" "}
                        <Link to="/register">Зарегистрируйтесь</Link>
                    </p>
                    <p>
                        <Link to="/reset-password">Забыли пароль?</Link>
                    </p>
                    <h1></h1>
                </div>
            </div>
        </>
    );
}
