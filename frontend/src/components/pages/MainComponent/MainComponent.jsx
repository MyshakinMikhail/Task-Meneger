import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./../../../hooks/useAuthStore";
import Antd from "./Antd/AntdComponent";

export default function Main() {
    // const logout = useAuthStore((state) => state.logout);
    const isAuth = useAuthStore((state) => state.isAuth);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("isAuth", isAuth);
    }, [isAuth]);

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
            console.log("user is not auth");
        }
    }, [isAuth, navigate]);

    return (
        <div className="container">
            <Antd />
        </div>
    );
}
