import axios from "axios";

const db_json = "http://localhost:3001";

export const fetchTasksAPI = () => axios.get(`${db_json}/tasks`);

export const addTaskAPI = (task) =>
    axios.post(`${db_json}/tasks`, task);

export const updateTaskAPI = (task) =>
    axios.put(`${db_json}/tasks/${task.id}`, task);

export const deleteTaskAPI = (id) =>
    axios.delete(`${db_json}/tasks/${id}`);