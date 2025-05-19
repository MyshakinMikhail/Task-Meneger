import { Button, Form, Input } from "antd";
import { useEffect } from "react";

export default function SendMessageToResetPasswordForm({
    sendMessage,
    email,
    setEmail,
}) {
    const [antdForm] = Form.useForm();

    useEffect(() => {
        antdForm.setFieldsValue({ email });
    }, [email, antdForm]);

    const onValuesChange = (changedValues) => {
        setEmail(changedValues.email);
    };

    return (
        <Form
            form={antdForm}
            onFinish={() => sendMessage({ email })}
            onValuesChange={onValuesChange}
            layout="vertical"
            className="send-message-form"
            style={{ maxWidth: 500, margin: "0 auto", padding: "24px" }}
        >
            <Form.Item
                label="Мы отправим ссылку для восстановления на адрес"
                name="email"
                rules={[
                    { required: true, message: "Пожалуйста, введите email" },
                    { type: "email", message: "Некорректный формат email" },
                ]}
            >
                <Input placeholder="Введите ваш email" size="large" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                    Отправить
                </Button>
            </Form.Item>
        </Form>
    );
}
