import api from "./axiosInstance";
export const getDashboardStats = () => api.get("/admin/stats");
export const getAllStudents = (search = "") => api.get(`/admin/students?search=${search}`);
export const getPendingStudents = () => api.get("/admin/students/pending");
export const approveStudent = (id) => api.patch(`/admin/students/${id}/approve`);
export const rejectStudent = (id) => api.patch(`/admin/students/${id}/reject`);
export const toggleAccountStatus = (id) => api.patch(`/admin/students/${id}/toggle-status`);
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);
export const getAuditLogs = (page = 1) => api.get(`/admin/audit-logs?page=${page}`);
