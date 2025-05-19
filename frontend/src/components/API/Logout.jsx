import useAuthStore from "./../../hooks/useAuthStore";
import api from "./../utils/api";

export default async function Logout(navigate) {
    try {
        const response = await api.post("/auth/logout");
        console.log("Ответ с бэка:", response.data.message);

        useAuthStore.getState().logout();
        navigate("/login");
    } catch (error) {
        console.error("Ошибка при выходе:", error.response.data.detail);
    }
}
