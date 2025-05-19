import { Alert, Button, Form, Input } from "antd";
import { useEffect } from "react";

export default function LoginFormComponent({
    handleSubmit,
    form,
    setForm,
    error,
    isLoading,
}) {
    const [antdForm] = Form.useForm();

    useEffect(() => {
        antdForm.setFieldsValue(form);
    }, [form, antdForm]);

    const onValuesChange = (changedValues) => {
        setForm({ ...form, ...changedValues });
    };

    return (
        <Form
            form={antdForm}
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            layout="vertical"
            className="login-form"
            style={{ maxWidth: 400, margin: "0 auto", padding: "24px" }}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Пожалуйста, введите email" },
                    { type: "email", message: "Некорректный формат email" },
                ]}
            >
                <Input placeholder="Введите ваш email" size="large" />
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                rules={[
                    { required: true, message: "Пожалуйста, введите пароль" },
                ]}
            >
                <Input.Password placeholder="Введите пароль" size="large" />
            </Form.Item>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    size="large"
                    block
                >
                    {isLoading ? "Вход..." : "Войти"}
                </Button>
            </Form.Item>
        </Form>
    );
}
