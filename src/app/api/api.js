import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:8000/api/v1",
    headers:{
        "Content-Type":"application/json",
    },
});

api.interceptors.request.use(
    (cfg) => {
        // SSR 가드: 브라우저에서만 localStorage 접근
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                // Axios v1: headers가 AxiosHeaders일 수도, plain object일 수도 있음
                if (cfg.headers && typeof cfg.headers.set === "function") {
                    cfg.headers.set("Authorization", `Bearer ${token}`);
                } else {
                    cfg.headers = cfg.headers || {};
                    cfg.headers["Authorization"] = `Bearer ${token}`;
                }
            }
        }
        return cfg;
    },
    (error) => Promise.reject(error)
);

export default api;