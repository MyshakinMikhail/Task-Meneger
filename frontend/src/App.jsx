import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/pages/Login/LoginComponent";
import Main from "./components/pages/MainComponent/MainComponent";
import Register from "./components/pages/Registration/RegisterComponent";
import ProtectedRoute from "./components/routes/ProtectedRouteComponent";
import "./styles/App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Route path="/reset-password" element={<ResetPassword />} /> */}
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
