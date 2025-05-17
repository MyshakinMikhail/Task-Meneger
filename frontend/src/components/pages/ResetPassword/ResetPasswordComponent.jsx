import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Инструкция по восстановлению пароля отправлена на " + email);
        navigate("/login");
    };

    return (
        <div className="container">
            <div className="authContainer">
                <h2>Восстановление пароля</h2>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="email"
                        placeholder="Введите ваш Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                    />
                    <button type="submit" className="button">
                        Восстановить
                    </button>
                </form>
                <p>
                    <Link to="/login">Вернуться к входу</Link>
                </p>
            </div>
        </div>
    );
}
