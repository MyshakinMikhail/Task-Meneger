import { Card, Tag, Typography } from "antd";
import dayjs from "dayjs";
import MyTooltips from "./../MyTooltips/MyTooltips";

const { Text } = Typography;

export default function MyTaskCard({
    task,
    showModal,
    deleteTask,
    startTask,
    completeTask,
}) {
    function getPriorityRu(task) {
        const priority = task.priority;

        switch (priority) {
            case "high":
                return "Высокий";
            case "medium":
                return "Средний";
            case "low":
                return "Низкий";
        }
    }

    const getStatusTag = (task) => {
        const today = dayjs();
        const dueDate = dayjs(task.dueDate);

        if (dueDate.isBefore(today, "day")) {
            return <Tag color="error">Просрочено</Tag>;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "red";
            case "medium":
                return "orange";
            case "low":
                return "green";
            default:
                return "blue";
        }
    };

    return (
        <Card
            key={task.id}
            size="small"
            style={{ marginBottom: "8px" }}
            actions={MyTooltips({
                task,
                showModal,
                deleteTask,
                startTask,
                completeTask,
            })}
        >
            <div>
                <div
                    style={{
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text strong>{task.title}</Text>
                    <Tag color={getPriorityColor(task.priority)}>
                        {getPriorityRu(task)}
                    </Tag>
                </div>
                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginBottom: "8px",
                    }}
                >
                    {task.description}
                </Text>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "50px",
                    }}
                >
                    <Text type="secondary">
                        Срок выполнения:{" "}
                        {dayjs(task.dueDate).format("MMM D, YYYY, HH:mm:ss")}
                    </Text>
                    {task.status != "completed" && getStatusTag(task)}
                </div>
            </div>
        </Card>
    );
}
