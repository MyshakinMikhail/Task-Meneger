import { Card, Tag, Typography } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import MyTooltips from "./../MyTooltips/MyTooltips";
import classes from "./MyTaskCard.module.css";

dayjs.extend(utc);

const { Text } = Typography;

export default function MyTaskCard({ task, showModal }) {
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
        const today = dayjs().utc();
        const dueDate = dayjs.utc(task.dueDate);

        if (task.status !== "completed" && dueDate.isBefore(today, "seconds")) {
            return <Tag color="error">Просрочено</Tag>;
        }
        return null;
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
            })}
        >
            <div>
                <div className={classes.header}>
                    <Text strong>{task.title}</Text>
                    <Tag color={getPriorityColor(task.priority)}>
                        {getPriorityRu(task)}
                    </Tag>
                </div>
                <Text type="secondary" className={classes.descripiton}>
                    {task.description}
                </Text>
                <div className={classes.footer}>
                    <Text type="secondary">
                        Срок выполнения:{" "}
                        {dayjs
                            .utc(task.dueDate)
                            .format("MMM D, YYYY, HH:mm:ss")}
                    </Text>
                    {getStatusTag(task)}
                </div>
            </div>
        </Card>
    );
}
