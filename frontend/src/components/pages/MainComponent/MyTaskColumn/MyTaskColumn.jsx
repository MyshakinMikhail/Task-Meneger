import { Card } from "antd";
import dayjs from "dayjs";
import useTasks from "../../../../hooks/useTasks";
import MyTaskCard from "./../MyTaskCard/MyTaskCard";
import classes from "./MyTaskColumnStyles.module.css";

export default function MyTaskColumn({ columns, showModal, sortOption }) {
    const { tasks } = useTasks();
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
        <div className={classes.columns}>
            {columns.map((column) => (
                <div className={classes.column} key={column.id}>
                    <Card
                        key={column.title}
                        title={column.title}
                        style={{ background: column.color }}
                        className={classes.Column}
                    >
                        {getColumnTasks(column.id).map((task) => (
                            <MyTaskCard
                                key={task.id}
                                task={task}
                                showModal={showModal}
                            />
                        ))}
                        {getColumnTasks(column.id).length === 0 && (
                            <div className={classes.noTask}>
                                В этой колонке нет задач
                            </div>
                        )}
                    </Card>
                </div>
            ))}
        </div>
    );
}
