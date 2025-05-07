import { PlusOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { Button, Select, Space, Typography } from "antd";
import classes from "./HeaderOfContent.module.css";

const { Title } = Typography;
const { Option } = Select;

export default function HeaderOfContent({ setSortOption, showModal }) {
    return (
        <div className={classes.header}>
            <Title level={4}>Доска с задачами</Title>
            <Space>
                <Select
                    placeholder="Сортировать по"
                    style={{ width: 150 }}
                    onChange={(value) => setSortOption(value)}
                    allowClear
                    suffixIcon={<SortAscendingOutlined />}
                >
                    <Option value="title">Заголовок</Option>
                    <Option value="description">Описание</Option>
                    <Option value="dueDate">Срок Выполнения</Option>
                    <Option value="priority">Приоритет</Option>
                </Select>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => showModal()}
                >
                    Добавить задачу
                </Button>
            </Space>
        </div>
    );
}
