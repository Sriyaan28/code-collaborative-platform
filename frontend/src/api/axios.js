import axios from "axios";

// baseUrl (render backend): https://code-collaborative-platform.onrender.com
// baseUrl(vercel backend): https://code-collaborative-platform.vercel.app/api
// baseUrl: http://localhost:8080/api
const axiosInstance = axios.create({
    baseURL: "https://code-collaborative-platform.vercel.app/api",
    withCredentials: true,
});

export default axiosInstance;