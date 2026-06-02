import api from "./axiosInstance";
export const getAllInternships = (params = {}) => api.get("/internships", { params });
export const getInternshipById = (id) => api.get(`/internships/${id}`);
export const createInternship = (data) => api.post("/internships", data);
export const updateInternship = (id, data) => api.put(`/internships/${id}`, data);
export const deleteInternship = (id) => api.delete(`/internships/${id}`);
export const toggleInternshipStatus = (id) => api.patch(`/internships/${id}/toggle-status`);
