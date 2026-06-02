import { useEffect, useState } from "react";
import { Users, FileText, Briefcase, Trophy, CheckCircle, Clock } from "lucide-react";
import { getDashboardStats } from "../../api/adminApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to || "#"} className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", transition: "transform 0.15s" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
    <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${color}55` }}>
      <Icon size={20} color="#fff" />
    </div>
    <div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{label}</p>
      <p style={{ color: "var(--text)", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>{value ?? "—"}</p>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = stats ? [
    { name: "Total Students", value: stats.totalStudents, color: "#6366f1" },
    { name: "Applications", value: stats.totalApplications, color: "#10b981" },
    { name: "Active Internships", value: stats.activeInternships, color: "#f59e0b" },
    { name: "Selected", value: stats.selectedApplications, color: "#3b82f6" },
    { name: "Completed", value: stats.completedApplications, color: "#8b5cf6" },
  ] : [];

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Admin Dashboard" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <LoadingSpinner /> : (
            <div className="animate-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Stat Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                <StatCard icon={Users} label="Total Students" value={stats?.totalStudents} color="#6366f1" to="/admin/students" />
                <StatCard icon={Clock} label="Pending Approvals" value={stats?.pendingApprovals} color="#f59e0b" to="/admin/students" />
                <StatCard icon={FileText} label="Total Applications" value={stats?.totalApplications} color="#10b981" to="/admin/applications" />
                <StatCard icon={Briefcase} label="Active Internships" value={stats?.activeInternships} color="#3b82f6" to="/admin/internships" />
                <StatCard icon={CheckCircle} label="Selected" value={stats?.selectedApplications} color="#8b5cf6" to="/admin/applications" />
                <StatCard icon={Trophy} label="Completed" value={stats?.completedApplications} color="#ec4899" to="/admin/applications" />
              </div>

              {/* Chart */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "1.25rem" }}>Platform Overview</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", color: "var(--text)" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Audit Logs */}
              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h2 style={{ color: "var(--text)", fontWeight: 700 }}>Recent Activity</h2>
                </div>
                {!stats?.recentLogs?.length
                  ? <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>No recent activity.</p>
                  : stats.recentLogs.map((log) => (
                    <div key={log._id} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--accent)", marginTop: "0.45rem", flexShrink: 0 }} />
                      <div>
                        <p style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: 500 }}>{log.action.replace(/_/g, " ")}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          By <strong>{log.performedBy?.name}</strong>
                          {log.targetUser && <> → <strong>{log.targetUser?.name}</strong></>}
                        </p>
                        <p style={{ color: "var(--text-faint)", fontSize: "0.72rem" }}>{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
