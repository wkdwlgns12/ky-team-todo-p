// 공용 axios 인스턴스
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // timeout: 8000
})

export default api
