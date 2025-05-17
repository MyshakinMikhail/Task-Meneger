// src/context/useTasks.js
import { useContext } from "react";
import { TasksContext } from "./../components/contexts/TaskContext";

export default function useTasks() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error("useTasks must be used within a TasksProvider");
    }
    return context;
}
