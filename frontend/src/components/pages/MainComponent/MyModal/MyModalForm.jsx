import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import GenerateDescription from "../../../API/GenerateDescription";
import useTasks from "./../../../../hooks/useTasks";
import Crud from "./../../../API/CRUD";

const { TextArea } = Input;
const { Option } = Select;

dayjs.extend(utc);

export default function MyModalFrom({
    form,
    editingTask,
    isModalVisible,
    setIsModalVisible,
    buttonRef,
}) {
    const { setTasks } = useTasks();

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    function addTask() {
        const values = form.getFieldsValue();
        const utcDueDate = values.dueDate
            ? dayjs(values.dueDate).utc().format()
            : null;
        Crud.AddTasks(
            { ...values, dueDate: utcDueDate },
            setTasks,
            setIsModalVisible
        );
    }

    function editTask() {
        const values = form.getFieldsValue();
        const utcDueDate = values.dueDate
            ? dayjs(values.dueDate).utc().format()
            : null;
        Crud.EditTasks(
            { ...values, dueDate: utcDueDate },
            editingTask,
            setTasks,
            setIsModalVisible
        );
    }

    function doRequestToGigachat() {
        GenerateDescription(form, buttonRef);
    }

    return (
        <Modal
            title={editingTask ? "Редактировать задачу" : "Создать задачу"}
            open={isModalVisible}
            onCancel={handleCancel}
            okText={editingTask ? "Сохранить" : "Создать"}
            cancelText="Отменить"
            onOk={editingTask ? editTask : addTask}
        >
            <Form
                form={form}
                layout="vertical"
                name="taskForm"
                initialValues={{
                    priority: "low",
                    dueDate: dayjs().add(1, "day"),
                    ...(editingTask && {
                        ...editingTask,
                        dueDate: editingTask.dueDate
                            ? dayjs.utc(editingTask.dueDate).local()
                            : null,
                    }),
                }}
            >
                <Form.Item
                    name="title"
                    label="Заголовок"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите заголовок",
                        },
                    ]}
                >
                    <Input placeholder="Укажите заголовок задачи" />
                </Form.Item>
                <Form.Item name="description" label="Описание">
                    <TextArea
                        rows={4}
                        placeholder="Укажите описание задачи (необязательно)"
                    />
                </Form.Item>
                <Form.Item
                    name="priority"
                    label="Приоритет"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, укажите приоритет",
                        },
                    ]}
                >
                    <Select placeholder="Укажите приоритет">
                        <Option value="low">Низкий</Option>
                        <Option value="medium">Средний</Option>
                        <Option value="high">Высокий</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="dueDate"
                    label="Срок выполнения"
                    getValueFromEvent={(value) => value}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : null,
                    })}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: "100%" }}
                        placeholder="Укажите срок выполнения задачи"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        ref={buttonRef}
                        type="primary"
                        onClick={doRequestToGigachat}
                    >
                        Сгенерировать описание по заголовку с Gigachat
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
