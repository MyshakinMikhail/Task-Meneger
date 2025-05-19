import api from "./../utils/api";

export default async function GenerateDescription(form, buttonRef) {
    try {
        const title = form.getFieldValue("title");

        const response = await api.get("/gigachat/get-description", {
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
