import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import Logout from "./../../../API/Logout";
import classes from "./MyHeader.module.css";

const { Header } = Layout;

export default function MyHeader({ username }) {
    const userMenuItems = [{ key: "logout", label: "Выйти" }];
    const navigate = useNavigate();

    const user = {
        name: username,
        avatar: null,
    };

    async function handleMenuClick({ key }) {
        switch (key) {
            case "logout":
                Logout(navigate);
                break;
            default:
                break;
        }
    }

    return (
        <Header className={classes.header}>
            <div className={classes.logo}>TaskHive</div>
            <div className={classes.main}>
                <Dropdown
                    menu={{ items: userMenuItems, onClick: handleMenuClick }}
                    placement="bottomRight"
                >
                    <div className={classes.avatar}>
                        <Avatar icon={<UserOutlined />} />
                        <span className={classes.span}>{user.name}</span>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
}
