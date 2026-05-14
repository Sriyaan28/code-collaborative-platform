import axios from "axios";

// baseUrl: https://code-collaborative-platform.vercel.app/api
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export default axiosInstance;