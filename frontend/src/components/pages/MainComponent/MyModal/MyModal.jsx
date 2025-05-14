import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useRef } from "react";
import api from "./../../../utils/api";
const { TextArea } = Input;
const { Option } = Select;

export default function MyModal({
    addTask,
    editTask,
    handleCancel,
    editingTask,
    form,
    isModalVisible,
}) {
    const buttonRef = useRef();

    async function doRequestToGigachat() {
        try {
            const title = form.getFieldValue("title");

            const response = await api.get("/gigachat/get_description", {
                params: { title: title },
            });

            form.setFieldsValue({
                description: response.data.description,
            });

            buttonRef.current?.blur();
        } catch (error) {
            console.error("Ошибка в запросе с GigaChat:", error);
        }
    }

    return (
        <Modal
            title={editingTask ? "Редактировать задачу" : "Создать задачу"}
            open={isModalVisible}
            onCancel={handleCancel}
            okText={editingTask ? "Сохранить" : "Создать"}
            cancelText={"Отменить"}
            onOk={editingTask ? editTask : addTask}
        >
            <Form
                form={form}
                layout="vertical"
                name="taskForm"
                initialValues={{
                    priority: "low",
                    dueDate: dayjs().add(1, "day"),
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
                <Form.Item name="dueDate" label="Срок выполнения">
                    <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        placeholder="Укажите срок выполнения задачи"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        ref={buttonRef}
                        color="primary"
                        variant="solid"
                        onClick={doRequestToGigachat}
                    >
                        Сгенерировать описание по заголовку с Gigachat
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
