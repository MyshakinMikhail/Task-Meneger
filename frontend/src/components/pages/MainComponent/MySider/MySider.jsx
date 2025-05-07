import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
const { Sider } = Layout;

export default function MySider({ colorBgContainer }) {
    const sidebarItems = [
        {
            key: "sub1",
            icon: <UserOutlined />,
            label: "Мои задачи",
            children: [{ key: "1", label: "Все задачи" }],
        },
    ];

    return (
        <Sider width={200} style={{ background: colorBgContainer }}>
            <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
                items={sidebarItems}
            />
        </Sider>
    );
}
