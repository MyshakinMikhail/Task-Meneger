import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles.css";
import Login from "./components/LoginComponent";
import Register from "./components/RegisterComponent";
// import ResetPassword from "./components/ResetPasswordComponent";
import Dashboard from "./components/DashBoardComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
