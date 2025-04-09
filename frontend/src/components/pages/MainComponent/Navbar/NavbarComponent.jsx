import cl from "./Navbar.module.css";

export default function Navbar({ logout }) {
    return (
        <div>
            <div className={cl.navbar}>
                <span>Task meneger с Gigachat поддержкой</span>
                <div className={cl.navbar__links}>
                    <button onClick={logout}>Выйти</button>
                </div>
            </div>
        </div>
    );
}
