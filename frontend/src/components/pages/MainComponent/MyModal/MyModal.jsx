import { useRef } from "react";
import api from "./../../../utils/api";
import MyModalFrom from "./MyModalForm";

export default function MyModal({
    editingTask,
    form,
    isModalVisible,
    setIsModalVisible,
}) {
    const buttonRef = useRef();

    async function doRequestToGigachat() {
        try {
            const title = form.getFieldValue("title");

            const response = await api.get("/gigachat/get_description", {
                params: { title: title },
            });

            form.setFieldsValue({
                description: response.data.description,
            });

            buttonRef.current?.blur();
        } catch (error) {
            console.error("Ошибка в запросе с GigaChat:", error);
        }
    }

    return (
        <MyModalFrom
            form={form}
            editingTask={editingTask}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            buttonRef={buttonRef}
            doRequestToGigachat={doRequestToGigachat}
        ></MyModalFrom>
    );
}
