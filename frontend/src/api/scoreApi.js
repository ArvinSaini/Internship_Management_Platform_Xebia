import api from "./axiosInstance";
export const assignScore = (data) => api.post("/scores", data);
export const getAllScores = () => api.get("/scores");
export const getLeaderboard = () => api.get("/scores/leaderboard");
export const getMyScore = () => api.get("/scores/my");
export const getScoreByApplication = (applicationId) => api.get(`/scores/application/${applicationId}`);
