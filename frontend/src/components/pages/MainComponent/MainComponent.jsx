import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./../../../hooks/useAuthStore";
import TaskManager from "./TaskMeneger";

export default function Main() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            console.log("Пользователь не авторизован");
        }
    }, [accessToken, navigate]);

    return (
        <div className="container">
            <TaskManager />
        </div>
    );
}
