import api from "./axiosInstance";
export const registerStudent = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");
