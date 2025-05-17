import { Form, Layout, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Crud from "../../API/CRUD";
import useAuthStore from "./../../../hooks/useAuthStore";
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
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (!accessToken) return;
        Crud.GetTasks(setUsername, setTasks);
    }, [accessToken]);

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

    const deleteTask = (taskId) => {
        Crud.DeleteTasks(Modal, taskId, tasks, setTasks);
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
        <Layout style={{ minHeight: "100vh" }}>
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
                            overflow: "auto",
                        }}
                    >
                        <HeaderOfContent
                            setSortOption={setSortOption}
                            showModal={showModal}
                        />
                        <MyTaskColumn
                            needToDo={needToDo}
                            startTask={startTask}
                            completeTask={completeTask}
                            deleteTask={deleteTask}
                            showModal={showModal}
                            getColumnTasks={getColumnTasks}
                            columns={columns}
                        />
                    </Content>
                </Layout>
            </Layout>
            <MyModal
                editingTask={editingTask}
                form={form}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                setTasks={setTasks}
            />
        </Layout>
    );
};

export default TaskManager;
