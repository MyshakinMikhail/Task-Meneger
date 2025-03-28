import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./utils/api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
      }); // отправление данных
      // код 200 => запрос выполнен успешно
      if (response.status === 200) {
        alert("Подтвердите Вашу почту");
      }
      navigate("/login");
    } catch (error) {
      // обработка ошибок 400, 409, 422 ( ошибка валидации пароля ), 500.
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError("Некорректный email. Проверьте введенные данные.");
            break;
          case 409:
            setError("Пользователь с таким email уже существует.");
            break;
          case 422:
            setError("Ошибка валидации: " + error.response.data.detail);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          required
          className="input"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="button">
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
