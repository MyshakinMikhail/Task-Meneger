import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Form, Layout, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        const sampleTasks = [
            {
                id: "1",
                title: "Create project plan",
                description:
                    "Outline the project scope, timeline, and deliverables",
                priority: "high",
                dueDate: dayjs().add(2, "day").format("YYYY-MM-DD"),
                status: "todo",
                column: "todo",
            },
            {
                id: "2",
                title: "Design user interface",
                description:
                    "Create wireframes and mockups for the application",
                priority: "medium",
                dueDate: dayjs().add(5, "day").format("YYYY-MM-DD"),
                status: "in-progress",
                column: "in-progress",
            },
            {
                id: "3",
                title: "Implement authentication",
                description: "Set up user authentication and authorization",
                priority: "high",
                dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
                status: "todo",
                column: "todo",
            },
            {
                id: "4",
                title: "Write documentation",
                description: "Document the API and user guide",
                priority: "low",
                dueDate: dayjs().add(10, "day").format("YYYY-MM-DD"),
                status: "todo",
                column: "todo",
            },
            {
                id: "5",
                title: "Fix login bug",
                description: "Resolve the issue with login on mobile devices",
                priority: "high",
                dueDate: dayjs().subtract(2, "day").format("YYYY-MM-DD"),
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

    const handleOk = () => {
        form.validateFields().then((values) => {
            const formattedTask = {
                ...values,
                id: editingTask ? editingTask.id : Date.now().toString(),
                dueDate: values.dueDate.format("YYYY-MM-DD"),
                status: editingTask ? editingTask.status : "todo",
                column: editingTask ? editingTask.column : "todo",
            };

            if (editingTask) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === editingTask.id ? formattedTask : task
                    )
                );
            } else {
                setTasks((prevTasks) => [...prevTasks, formattedTask]);
            }

            setIsModalVisible(false);
            form.resetFields();
        });
    };

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
            onOk() {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== taskId)
                );
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
                case "description":
                    return a.description.localeCompare(b.description);
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
            <MyHeader />
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
                handleOk={handleOk}
                form={form}
                editingTask={editingTask}
                isModalVisible={isModalVisible}
            />
        </Layout>
    );
};

export default TaskManager;
