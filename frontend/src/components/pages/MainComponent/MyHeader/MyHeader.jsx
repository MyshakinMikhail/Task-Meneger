import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../hooks/useAuthStore";
import classes from "./MyHeader.module.css";

const { Header } = Layout;

export default function MyHeader() {
    const navigate = useNavigate();

    const userMenuItems = [
        { key: "profile", label: "Профиль" },
        { key: "settings", label: "Настройки" },
        { key: "logout", label: "Выйти" },
    ];

    const user = {
        name: "Михаил Мышакин",
        avatar: null,
        email: "john.doe@example.com",
    };

    function handleMenuClick({ key }) {
        switch (key) {
            case "profile":
                console.log("Click on profile");
                break;
            case "settings":
                console.log("Click on settings");
                break;
            case "logout":
                useAuthStore.getState().logout();
                console.log("Вы вышли из системы");
                console.log(
                    "Текущее состояние accessToken - " +
                        localStorage.getItem("access")
                ); // должен быть undefined
                navigate("/login");
                break;
            default:
                break;
        }
    }

    return (
        <Header className={classes.header}>
            <div className={classes.logo}>TaskManager</div>
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
