import api from "./axiosInstance";
export const getProfile = () => api.get("/students/profile");
export const updateProfile = (data) => api.put("/students/profile", data);
export const changePassword = (data) => api.put("/students/change-password", data);
export const updateProfilePicture = (formData) => api.put("/students/profile-picture", formData);
export const uploadResume = (formData) => api.put("/students/resume", formData);
export const getNotifications = () => api.get("/students/notifications");
export const markNotificationRead = (id) => api.patch(`/students/notifications/${id}/read`);
export const markAllRead = () => api.patch("/students/notifications/read-all");
