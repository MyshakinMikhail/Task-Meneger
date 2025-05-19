import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResetPasswordServise from "../../API/ResetPasswordServise";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
    const { token } = useParams();
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changePassword = async () => {
        ResetPasswordServise.PostResetPassword(token, form, setError, navigate);
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
