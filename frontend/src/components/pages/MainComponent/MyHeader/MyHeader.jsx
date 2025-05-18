import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../hooks/useAuthStore";
import api from "./../../../utils/api";
import classes from "./MyHeader.module.css";

const { Header } = Layout;

export default function MyHeader({ username }) {
    const navigate = useNavigate();

    const userMenuItems = [{ key: "logout", label: "Выйти" }];

    const user = {
        name: username,
        avatar: null,
        email: "john.doe@example.com",
    };

    async function handleMenuClick({ key }) {
        switch (key) {
            case "profile":
                console.log("Click on profile");
                break;
            case "settings":
                console.log("Click on settings");
                break;
            case "logout":
                try {
                    const response = await api.post("/auth/logout");
                    console.log("Ответ с бэка:", response.data.message);

                    useAuthStore.getState().logout();
                    console.log("Вы вышли из системы");
                    console.log(
                        "Текущее состояние accessToken - " +
                            localStorage.getItem("access")
                    );
                    navigate("/login");
                } catch (error) {
                    console.error(
                        "Ошибка при выходе:",
                        error.response.data.detail
                    );
                }
                break;
            default:
                break;
        }
    }

    return (
        <Header className={classes.header}>
            <div className={classes.logo}>TaskHive</div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <Dropdown
                    menu={{ items: userMenuItems, onClick: handleMenuClick }}
                    placement="bottomRight"
                >
                    <div
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Avatar icon={<UserOutlined />} />
                        <span style={{ color: "white" }}>{user.name}</span>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
}
