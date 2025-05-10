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
    const username = "Имя пользователя";

    // const [username, setUsername] = useState("Имя пользователя");

    // const [isTasksLoading, setIsTasksLoading] = useState(false)

    // ПОДГРУЗКА ЗАДАЧ С БЭКА

    // useEffect(() => {
    //     async function fetchTasks() {
    //         try {
    //             const response = await api.get("/tasks/me");
    //             setUsername(response.data.username)

    //             const userTasks = response.data.tasks || [];\
    //             const sampleTasks = [
    //                 {
    //                     id: createUniqueKey(),
    //                     title: "Добро пожаловать в TaskMeneger",
    //                     description:
    //                         "В данном приложении вы можете автоматически сгенерировать описание заметки по ее заголовку",
    //                     priority: "high",
    //                     dueDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    //                     status: "todo",
    //                     column: "todo",
    //                 },
    //                 ...userTasks,
    //             ];

    //             setTasks(sampleTasks);
    //         } catch (error) {
    //             console.log("Произошла ошибка при загрузке задач ", error);
    //         }
    //     }

    //     fetchTasks();
    // }, []);

    useEffect(() => {
        const sampleTasks = [
            {
                id: "1",
                title: "Добро пожаловать в TaskMeneger",
                description:
                    "В данном приложении вы можете автоматически сгенерировать описание заметки по ее заголовку",
                priority: "high",
                dueDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                status: "todo",
                column: "todo",
            },
        ];
        setTasks(sampleTasks);
    }, []);

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

                setTasks((prevTasks) => [...prevTasks, formattedTask]);

                // тут стоят мои id, не из бд !!!

                // тут запрос на бэк
                const response = await api.post("/tasks/create-task", {
                    ...formattedTask,
                });
                console.log("Запрос прошел, можно брать данные из запроса");
                formattedTask.id = response.data.id; // -> для обновления id, чтобы соответствовало бэку

                // замена id на значение из бд ( тут баг )
                // const new_id = 10;
                // setTasks((prevTasks) =>
                //     prevTasks.map((task) =>
                //         task.id === editingTask.id
                //             ? { ...formattedTask, id: new_id }
                //             : task
                //     )
                // );

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

                // тут запрос на бэк
                // const response = await api.put("/tasks/edit-task", {...formattedTask})

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

    const startTask = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: "in-progress", column: "in-progress" }
                    : task
            )
        );
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
                    //await api.delete("/tasks/delete-task", { data: { taskId } }); //  - запрос на удаление заметки в бд
                    setTasks((prevTasks) =>
                        prevTasks.filter((task) => task.id !== taskId)
                    );
                } catch (error) {
                    console.log(
                        "Произошла ошибка при удалении заметки" + error
                    );
                }
            },
        });
    };

    const completeTask = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: "completed", column: "completed" }
                    : task
            )
        );
    };

    const getColumnTasks = (columnId) => {
        return sortTasks(tasks.filter((task) => task.column === columnId));
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
