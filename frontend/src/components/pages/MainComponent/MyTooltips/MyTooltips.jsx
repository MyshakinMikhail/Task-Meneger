import {
    CheckCircleOutlined,
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useTooltipsActions } from "./../../../../hooks/useTooltipsActions";

export default function MyTooltips({ task, showModal }) {
    const { needToDo, startTask, completeTask, deleteTask } =
        useTooltipsActions();

    return [
        <Tooltip key="edit" title="Редактировать">
            <EditOutlined onClick={() => showModal(task)} />
        </Tooltip>,
        <Tooltip key="delete" title="Удалить">
            <DeleteOutlined onClick={() => deleteTask(task.id)} />
        </Tooltip>,
        <Tooltip key="todo" title="Вернуть в нужно сделать">
            <RollbackOutlined onClick={() => needToDo(task.id)} />
        </Tooltip>,
        <Tooltip key="in-progres" title="Отметить начатым">
            <CheckOutlined onClick={() => startTask(task.id)} />
        </Tooltip>,
        <Tooltip key="complete" title="Отметить выполненным">
            <CheckCircleOutlined onClick={() => completeTask(task.id)} />
        </Tooltip>,
    ];
}
