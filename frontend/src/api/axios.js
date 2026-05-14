import axios from "axios";

// baseUrl: https://code-collaborative-platform.vercel.app/api
const axiosInstance = axios.create({
    baseURL: "https://code-collaborative-platform.vercel.app/api",
    withCredentials: true,
});

export default axiosInstance;