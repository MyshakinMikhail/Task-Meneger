import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
// import Header from "./Header/HeaderComponent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      login({ email });
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="container">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button">
            Войти
          </button>
        </form>
        <p>
          <Link to="/reset-password">Забыли пароль?</Link>
        </p>
        <p>
          Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
        </p>
      </div>
    </>
  );
}
