import { DatePicker, Form, Input, Modal, Select } from "antd";
const { TextArea } = Input;
const { Option } = Select;

export default function MyModal({
    handleOk,
    handleCancel,
    editingTask,
    form,
    isModalVisible,
}) {
    return (
        <Modal
            title={editingTask ? "Редактировать задачу" : "Создать задачу"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={editingTask ? "Сохранить" : "Создать"}
        >
            <Form form={form} layout="vertical" name="taskForm">
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
                <Form.Item
                    name="description"
                    label="Описание"
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, введите описание",
                        },
                    ]}
                >
                    <TextArea rows={4} placeholder="Укажите описание задачи" />
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
                    rules={[
                        {
                            required: true,
                            message: "Пожалуйста, укажите дату",
                        },
                    ]}
                >
                    <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        placeholder="Укажите срок выполнения задачи"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
