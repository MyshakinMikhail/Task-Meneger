import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../hooks/useAuthStore";
export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.email && form.password) {
            // запрос на бэк, с целью проверки корректности валидации
            // ответ: пользователь есть или пользователя нет
            // получаю jwt токены и добавляю их в логу
            login(true);
            console.log("user auth");
            navigate("/main");
        }
    };

    return (
        <>
            {/* <Header /> */}
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
                        <button type="submit" className="button">
                            Войти
                        </button>
                    </form>
                    {/* <p>
        <Link to="/reset-password">Забыли пароль?</Link>
        </p> */}
                    <p>
                        Нет аккаунта?{" "}
                        <Link to="/register">Зарегистрируйтесь</Link>
                    </p>
                    <h1></h1>
                </div>
            </div>
        </>
    );
}
