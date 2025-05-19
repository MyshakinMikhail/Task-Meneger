import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./../../utils/api";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
    const { token } = useParams();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changePassword = async () => {
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
                <ResetPasswordForm
                    changePassword={changePassword}
                    form={form}
                    setForm={setForm}
                    error={error}
                />
            </div>
        </div>
    );
}
