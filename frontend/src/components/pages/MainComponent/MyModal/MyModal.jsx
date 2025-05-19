import { useRef } from "react";
import MyModalFrom from "./MyModalForm";

export default function MyModal({
    editingTask,
    form,
    isModalVisible,
    setIsModalVisible,
}) {
    const buttonRef = useRef();

    return (
        <MyModalFrom
            form={form}
            editingTask={editingTask}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            buttonRef={buttonRef}
        ></MyModalFrom>
    );
}
