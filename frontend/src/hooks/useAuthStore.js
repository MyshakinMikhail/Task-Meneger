import { create } from "zustand";

const useAuthStore = create((set) => ({
    accessToken: null,
    isAuth: false,

    login: (token) => {
        localStorage.setItem("access", token);
        set({ accessToken: token, isAuth: true });
    },

    logout: () => {
        localStorage.removeItem("access");
        set({ accessToken: null, isAuth: false });
    },
}));

const initialIsAuth = localStorage.getItem("isAuth");

useAuthStore.setState({
    isAuth: initialIsAuth,
});
export default useAuthStore;
