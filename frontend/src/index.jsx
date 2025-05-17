import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { TasksProvider } from "./components/contexts/TaskContext.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
    <TasksProvider>
        <App />
    </TasksProvider>
);
