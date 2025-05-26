import { ExclamationCircleOutlined } from "@ant-design/icons";
import { v4 as createUniqueKey } from "uuid";
import api from "../utils/api";

export default class Crud {
    static async GetTasks(setUsername, setTasks) {
        try {
            const response = await api.get("/tasks/me");
            setUsername(response.data.username);

            const userTasks = (response.data?.notes || []).map((task) => ({
                ...task,
                dueDate: task.dueDate ? task.dueDate.replace("Z", "") : null,
            }));
            setTasks(userTasks);

            console.log(userTasks);
        } catch (error) {
            console.log("Произошла ошибка при загрузке задач ", error);
        }
    }
    static async AddTasks(form, setTasks, setIsModalVisible) {
        try {
            form.validateFields().then(async (values) => {
                const title = values.title;
                const formattedTask = {
                    ...values,
                    title: title.charAt(0).toUpperCase() + title.slice(1),
                    id: createUniqueKey(),
                    dueDate: values.dueDate.format("YYYY-MM-DD HH:mm:ss"),
                    status: "todo",
                    column: "todo",
                };

                const response = await api.post("/tasks/create-task", {
                    ...formattedTask,
                });

                setTasks((prevTasks) => [
                    ...prevTasks,
                    { ...formattedTask, id: response.data.id },
                ]);

                setIsModalVisible(false);
                form.resetFields();
            });
        } catch (error) {
            console.log("Ошибка создания заметки" + error);
        }
    }
    static async EditTasks(form, editingTask, setTasks, setIsModalVisible) {
        try {
            form.validateFields().then(async (values) => {
                const formattedTask = {
                    ...values,
                    title:
                        values.title.charAt(0).toUpperCase() +
                        values.title.slice(1),
                    id: editingTask.id,
                    dueDate: values.dueDate.format("YYYY-MM-DD HH:mm:ss"),
                    status: editingTask.status,
                    column: editingTask.column,
                };

                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === editingTask.id ? formattedTask : task
                    )
                );

                await api.put(`/tasks/edit-task/${editingTask.id}`, {
                    ...formattedTask,
                });

                setIsModalVisible(false);
                form.resetFields();
            });
        } catch {
            console.log("Ошибка редактирования заметки");
        }
    }
    static async DeleteTasks(Modal, taskId, tasks, setTasks) {
        Modal.confirm({
            title: `Вы уверены, что хотите удалить задачу ${
                tasks.filter((task) => task.id == taskId)[0].title
            }?`,
            icon: <ExclamationCircleOutlined />,
            content: "Это действие не может быть проигнорировано.",
            okText: "Да",
            okType: "danger",
            cancelText: "Нет",
            async onOk() {
                try {
                    await api.delete(`/tasks/delete-task/${taskId}`);
                    setTasks((prevTasks) =>
                        prevTasks.filter((task) => task.id !== taskId)
                    );
                } catch (error) {
                    console.log(
                        "Произошла ошибка при удалении заметки " + error
                    );
                }
            },
        });
    }
}
