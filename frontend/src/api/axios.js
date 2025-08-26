import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})

export const getMenus = () => api.get("/api/menus");

export const addMenu = (name) => api.post("/api/menus", { name });

export const voteMenu = (id) => api.post(`/api/menus/${id}/vote`);

export const deleteMenu = (id) => api.delete(`/api/menus/${id}`);
export default api;
