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

    return { needToDo };
}
