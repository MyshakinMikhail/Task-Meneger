import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Layout, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as createUniqueKey } from "uuid";
import api from "./../../utils/api";
import HeaderOfContent from "./HeaderOfContent/HeaderOfContent";
import MyHeader from "./MyHeader/MyHeader";
import MyModal from "./MyModal/MyModal";
import MySider from "./MySider/MySider";
import MyTaskColumn from "./MyTaskColumn/MyTaskColumn";

const { Content } = Layout;

const TaskManager = () => {
    const initialColumns = [
        { id: "todo", title: "Нужно сделать", color: "#f0f0f0" },
        { id: "in-progress", title: "В процессе", color: "#e6f7ff" },
        { id: "completed", title: "Выполнены", color: "#f6ffed" },
    ];

    const [tasks, setTasks] = useState([]);
    const [columns] = useState(initialColumns);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();
    const [sortOption, setSortOption] = useState(null);
    const [username, setUsername] = useState("Имя пользователя");

    // const [isTasksLoading, setIsTasksLoading] = useState(false)

    // ПОДГРУЗКА ЗАДАЧ С БЭКА
    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await api.get("/tasks/me");
                setUsername(response.data.username);

                // console.log(
                //     "Запрос прошел успешно за пользовательскими данными прошел успешно"
                // );
                const userTasks = response.data.notes || [];
                // console.log(userTasks);
                setTasks(userTasks);
            } catch (error) {
                console.log("Произошла ошибка при загрузке задач ", error);
            }
        }

        fetchTasks();
    }, []);

    useEffect(() => {
        console.log("Текущие задачи", tasks);
    }, [tasks]);

    const showModal = (task) => {
        if (task) {
            setEditingTask(task);
            form.setFieldsValue({
                ...task,
                dueDate: dayjs(task.dueDate),
            });
        } else {
            setEditingTask(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    function addTask() {
        try {
            form.validateFields().then(async (values) => {
                const formattedTask = {
                    ...values,
                    id: createUniqueKey(), // это первичный id, нужен будет id заметки с бэка
                    dueDate: values.dueDate.format("YYYY-MM-DD HH:mm:ss"),
                    status: "todo",
                    column: "todo",
                };

                const response = await api.post("/tasks/create-task", {
                    ...formattedTask,
                });
                console.log("Запрос прошел, можно брать данные из запроса");
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

    function editTask() {
        try {
            form.validateFields().then(async (values) => {
                const formattedTask = {
                    ...values,
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

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const deleteTask = (taskId) => {
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
                    await api.delete(`/tasks/delete-task/${taskId}`); //  - запрос на удаление заметки в бд
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
    };

    async function needToDo(taskId) {
        const updatedTask = tasks.find((task) => task.id === taskId);
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

    const getColumnTasks = (columnId) => {
        return sortTasks(tasks.filter((task) => task.status === columnId));
    };

    const sortTasks = (tasks) => {
        return [...tasks].sort((a, b) => {
            switch (sortOption) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "dueDate":
                    return dayjs(a.dueDate).diff(dayjs(b.dueDate));
                case "priority": {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return (
                        priorityOrder[a.priority] - priorityOrder[b.priority]
                    );
                }
                default:
                    return 0;
            }
        });
    };

    return (
        <Layout style={{ minHeight: "100vh", overflow: "auto" }}>
            <MyHeader username={username} />
            <Layout>
                <MySider colorBgContainer="white" />
                <Layout style={{ padding: "24px 24px 24px" }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            backgroundColor: "white",
                            borderRadius: "7px",
                        }}
                    >
                        <HeaderOfContent
                            setSortOption={setSortOption}
                            showModal={showModal}
                        />
                        <MyTaskColumn
                            needToDo={needToDo}
                            startTask={startTask}
                            deleteTask={deleteTask}
                            showModal={showModal}
                            completeTask={completeTask}
                            getColumnTasks={getColumnTasks}
                            columns={columns}
                        />
                    </Content>
                </Layout>
            </Layout>
            <MyModal
                handleCancel={handleCancel}
                addTask={addTask}
                editTask={editTask}
                form={form}
                editingTask={editingTask}
                isModalVisible={isModalVisible}
            />
        </Layout>
    );
};

export default TaskManager;
