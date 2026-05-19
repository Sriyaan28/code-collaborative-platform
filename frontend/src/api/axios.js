import axios from "axios";

// baseUrl: https://code-collaborative-platform.vercel.app/api
// baseUrl: http://localhost:8080/api
const axiosInstance = axios.create({
    baseURL: "https://code-collaborative-platform.vercel.app/api",
    withCredentials: true,
});

export default axiosInstance;