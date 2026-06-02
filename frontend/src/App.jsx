import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsPage";
import InternshipsPage from "./pages/admin/InternshipsPage";
import ApplicationsPage from "./pages/admin/ApplicationsPage";
import ScoreManagementPage from "./pages/admin/ScoreManagementPage";
import AdminLeaderboardPage from "./pages/admin/LeaderboardPage";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseInternships from "./pages/student/BrowseInternships";
import MyApplications from "./pages/student/MyApplications";
import MyScorePage from "./pages/student/MyScorePage";
import StudentLeaderboardPage from "./pages/student/LeaderboardPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import ProfilePage from "./pages/student/ProfilePage";

const App = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === "Admin" ? "/admin/dashboard" : "/dashboard"} replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/students" element={<AdminRoute><StudentsPage /></AdminRoute>} />
      <Route path="/admin/internships" element={<AdminRoute><InternshipsPage /></AdminRoute>} />
      <Route path="/admin/applications" element={<AdminRoute><ApplicationsPage /></AdminRoute>} />
      <Route path="/admin/scores" element={<AdminRoute><ScoreManagementPage /></AdminRoute>} />
      <Route path="/admin/leaderboard" element={<AdminRoute><AdminLeaderboardPage /></AdminRoute>} />

      {/* Student routes */}
      <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/internships" element={<ProtectedRoute><BrowseInternships /></ProtectedRoute>} />
      <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
      <Route path="/my-score" element={<ProtectedRoute><MyScorePage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><StudentLeaderboardPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={user ? (user.role === "Admin" ? "/admin/dashboard" : "/dashboard") : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
