import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container">
      <h2>Добро пожаловать, {user.email}!</h2>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="button"
      >
        Выйти
      </button>
    </div>
  );
}
