import { Alert, Button, Form, Input, Space } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ResetPasswordForm({
    changePassword,
    form,
    setForm,
    error,
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
            onFinish={changePassword}
            onValuesChange={onValuesChange}
            layout="vertical"
            className="reset-password-form"
            style={{ maxWidth: 400, margin: "0 auto", padding: "24px" }}
        >
            <Form.Item
                label="Новый пароль"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста, введите новый пароль",
                    },
                ]}
            >
                <Input.Password
                    placeholder="Введите новый пароль"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Подтвердите новый пароль"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                    {
                        required: true,
                        message: "Пожалуйста, подтвердите пароль",
                    },
                ]}
            >
                <Input.Password
                    placeholder="Подтвердите новый пароль"
                    size="large"
                />
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
                <Button type="primary" htmlType="submit" size="large" block>
                    Восстановить
                </Button>
            </Form.Item>

            <Space direction="horizontal" align="center" className="w-full">
                <Link
                    to="/reset-password/email"
                    className="text-blue-500 hover:text-blue-700"
                >
                    Назад
                </Link>
            </Space>
        </Form>
    );
}
