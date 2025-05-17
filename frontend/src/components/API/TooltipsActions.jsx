// import api from "./../utils/api";

// export default class TooltipsActions {
//     static async needToDo(taskId) {
//         const updatedTask = tasks.find((task) => task.id === taskId);
//         const updatedTaskWithNewColumn = {
//             ...updatedTask,
//             status: "todo",
//             column: "todo",
//         };

//         setTasks((prevTasks) =>
//             prevTasks.map((task) =>
//                 task.id === taskId ? updatedTaskWithNewColumn : task
//             )
//         );

//         await api.put(`/tasks/edit-task/${taskId}`, {
//             ...updatedTaskWithNewColumn,
//         });
//     }
// }
