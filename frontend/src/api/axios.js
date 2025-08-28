import axios from "axios";

// 환경 변수 기반 baseURL 설정
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// ---- API 함수 모음 ----

// 메뉴 전체 조회
export const getMenus = () => api.get("/api/menus");

// 메뉴 추가
export const addMenu = (name) => api.post("/api/menus", { name });

// 투표 +1
export const voteMenu = (id) => api.post(`/api/menus/${id}/vote`);

// 투표 -1
export const unvoteMenu = (id) => api.post(`/api/menus/${id}/unvote`);

// 메뉴 수정
export const updateMenu = (id, name) =>
    api.put(`/api/menus/${id}`, { name });

// 메뉴 삭제
export const deleteMenu = (id) => api.delete(`/api/menus/${id}`);

// 기본 인스턴스도 export
export default api;
