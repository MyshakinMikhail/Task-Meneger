import { create } from "zustand";

const useAuthStore = create((set) => ({
    accessToken: null,

    login: (token) => {
        localStorage.setItem("access", token);
        console.log("Token - ", token, " сохранен в localStorage");
        set({ accessToken: token });
    },

    logout: () => {
        localStorage.removeItem("access");
        console.log("Токен удален из localStorage");
        set({ accessToken: null });
    },
}));

const initialIsToken = localStorage.getItem("access");

useAuthStore.setState({
    accessToken: initialIsToken,
});

export default useAuthStore;
