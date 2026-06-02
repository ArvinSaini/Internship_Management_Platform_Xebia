import api from "./axiosInstance";
export const applyToInternship = (data) => api.post("/applications", data);
export const getMyApplications = () => api.get("/applications/my");
export const getAllApplications = (params = {}) => api.get("/applications", { params });
export const updateApplicationStatus = (id, data) => api.patch(`/applications/${id}/status`, data);
