import { Card } from "antd";
import MyTaskCard from "./../MyTaskCard/MyTaskCard";
import MyTaskColumnStyles from "./MyTaskColumnStyles.module.css";

export default function MyTaskColumn({
    needToDo,
    columns,
    getColumnTasks,
    showModal,
    deleteTask,
    completeTask,
    startTask,
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: "16px",
            }}
        >
            {columns.map((column) => (
                <div
                    key={column.id}
                    style={{ minWidth: "300px", width: "33%" }}
                >
                    <Card
                        key={column.title}
                        title={column.title}
                        style={{ background: column.color }}
                        className={MyTaskColumnStyles.column}
                    >
                        {getColumnTasks(column.id).map((task) => (
                            <MyTaskCard
                                key={task.id}
                                task={task}
                                needToDo={needToDo}
                                showModal={showModal}
                                deleteTask={deleteTask}
                                startTask={startTask}
                                completeTask={completeTask}
                            />
                        ))}
                        {getColumnTasks(column.id).length === 0 && (
                            <div
                                style={{
                                    padding: "16px",
                                    textAlign: "center",
                                    color: "#999",
                                }}
                            >
                                В этой колонке нет задач
                            </div>
                        )}
                    </Card>
                </div>
            ))}
        </div>
    );
}
