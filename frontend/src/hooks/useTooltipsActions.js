import { Modal } from "antd";
import Crud from "./../components/API/CRUD";
import api from "./../components/utils/api";
import useTasks from "./useTasks";

export function useTooltipsActions() {
    const { tasks, setTasks } = useTasks();

    async function needToDo(taskId) {
        const updatedTask = tasks.find((task) => task.id === taskId);
        if (!updatedTask) return;

        const updatedTaskWithNewColumn = {
            ...updatedTask,
            status: "todo",
            column: "todo",
        };

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? updatedTaskWithNewColumn : task
            )
        );

        await api.put(`/tasks/edit-task/${taskId}`, {
            ...updatedTaskWithNewColumn,
        });
    }

    async function startTask(taskId) {
        const updatedTask = tasks.find((task) => task.id === taskId);
        const updatedTaskWithNewColumn = {
            ...updatedTask,
            status: "in-progress",
            column: "in-progress",
        };

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? updatedTaskWithNewColumn : task
            )
        );

        await api.put(`/tasks/edit-task/${taskId}`, {
            ...updatedTaskWithNewColumn,
        });
    }

    async function completeTask(taskId) {
        const updatedTask = tasks.find((task) => task.id === taskId);
        const updatedTaskWithNewColumn = {
            ...updatedTask,
            status: "completed",
            column: "completed",
        };

        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? updatedTaskWithNewColumn : task
            )
        );

        await api.put(`/tasks/edit-task/${taskId}`, {
            ...updatedTaskWithNewColumn,
        });
    }
    async function deleteTask(taskId) {
        Crud.DeleteTasks(Modal, taskId, tasks, setTasks);
    }

    return { needToDo, startTask, completeTask, deleteTask };
}
