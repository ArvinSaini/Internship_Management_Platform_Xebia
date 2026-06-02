import axios from "axios";

const axiosInstance = axios.create({ baseURL: "/api", withCredentials: true });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("imp-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("imp-token");
      localStorage.removeItem("imp-user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
