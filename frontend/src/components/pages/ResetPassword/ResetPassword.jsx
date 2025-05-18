import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "./../../utils/api";

export default function ResetPassword() {
    const { token } = useParams();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changePassword = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (!token) {
            setError(
                "Ссылка для восстановления недействительна или устарела. Попробуйте запросить новую."
            );
            return;
        }

        try {
            const response = await api.post(
                `/reset-password/change-password/${token}`,
                { password: form.password }
            );

            if (response.status === 200) {
                alert("Пароль успешно изменен");
                navigate("/login");
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
    };

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Восстановление пароля</h2>
                <form onSubmit={changePassword} className="form">
                    <input
                        type="password"
                        placeholder="Введите новый пароль"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        required
                        className="input"
                    />
                    <input
                        type="password"
                        placeholder="Подтвердите новый пароль"
                        value={form.confirmPassword}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                confirmPassword: e.target.value,
                            })
                        }
                        required
                        className="input"
                    />

                    <button type="submit" className="button">
                        Восстановить
                    </button>
                    <p>
                        <Link to="/reset-password/email">Назад</Link>
                    </p>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
}
