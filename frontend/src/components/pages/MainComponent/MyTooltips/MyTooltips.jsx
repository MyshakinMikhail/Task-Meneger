import {
    CheckCircleOutlined,
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";

export default function MyTooltips({
    task,
    showModal,
    deleteTask,
    startTask,
    completeTask,
}) {
    return [
        <Tooltip key="edit" title="Редактировать">
            <EditOutlined onClick={() => showModal(task)} />
        </Tooltip>,
        <Tooltip key="delete" title="Удалить">
            <DeleteOutlined onClick={() => deleteTask(task.id)} />
        </Tooltip>,
        <Tooltip key="in-progres" title="Отметить начатым">
            <CheckOutlined onClick={() => startTask(task.id)} />
        </Tooltip>,
        <Tooltip key="complete" title="Отметить выполненным">
            <CheckCircleOutlined onClick={() => completeTask(task.id)} />
        </Tooltip>,
    ];
}
