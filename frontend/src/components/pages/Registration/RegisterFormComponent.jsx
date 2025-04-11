export default function RegisterForm({
    handleSubmit,
    form,
    setForm,
    error,
    isLoading,
}) {
    return (
        <form onSubmit={handleSubmit} method="post" className="form">
            <input
                type="text"
                placeholder="Имя пользователя"
                value={form.username} // Измени на "form.username"
                onChange={(e) => setForm({ ...form, username: e.target.value })} // Измени на "username"
                required
                className="input"
            />
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
    );
}
