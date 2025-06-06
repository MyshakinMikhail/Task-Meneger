import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login/LoginComponent";
import Main from "./components/pages/MainComponent/MainComponent";
import Register from "./components/pages/Registration/RegisterComponent";
import ResetPassword from "./components/pages/ResetPassword/ResetPassword";
import SendMessageToResetPassword from "./components/pages/ResetPassword/SendMessageToResetPassword";
import VerifyEmail from "./components/pages/VerifyEmail/VerifyEmail";
import ProtectedRoute from "./components/routes/ProtectedRouteComponent";
import "./styles/App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/update-password/:token"
                    element={<ResetPassword />}
                />
                <Route
                    path="/reset-password/email"
                    element={<SendMessageToResetPassword />}
                />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}
