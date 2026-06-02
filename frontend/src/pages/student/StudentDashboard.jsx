import { useEffect, useState } from "react";
import { Briefcase, FileText, Trophy, Star, Clock, CheckCircle } from "lucide-react";
import { getMyApplications } from "../../api/applicationApi";
import { getLeaderboard } from "../../api/scoreApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Leaderboard from "../../components/score/Leaderboard";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const statusBadge = {
  "Pending": "badge-warning", "Under Review": "badge-info",
  "Selected": "badge-success", "Rejected": "badge-danger", "Completed": "badge-accent",
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyApplications(), getLeaderboard()])
      .then(([appsRes, lbRes]) => { setApps(appsRes.data.data); setTopScores(lbRes.data.data.slice(0, 5)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === "Pending").length,
    selected: apps.filter(a => a.status === "Selected").length,
    completed: apps.filter(a => a.status === "Completed").length,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Dashboard" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <LoadingSpinner /> : (
            <div className="animate-fadein" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Welcome */}
              <div className="card" style={{ padding: "1.5rem", background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)", border: "none", color: "#fff" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.3rem", marginBottom: "0.25rem" }}>Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
                <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>Track your internship applications and performance.</p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.85rem" }}>
                {[
                  { icon: FileText, label: "Total Applied", value: counts.total, color: "#6366f1" },
                  { icon: Clock, label: "Pending", value: counts.pending, color: "#f59e0b" },
                  { icon: CheckCircle, label: "Selected", value: counts.selected, color: "#10b981" },
                  { icon: Trophy, label: "Completed", value: counts.completed, color: "#8b5cf6" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                    <div>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.73rem" }}>{label}</p>
                      <p style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.4rem", lineHeight: 1 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick links + Recent Applications */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {/* Recent apps */}
                <div className="card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
                    <h3 style={{ color: "var(--text)", fontWeight: 700 }}>Recent Applications</h3>
                    <Link to="/my-applications" style={{ color: "var(--accent)", fontSize: "0.8rem", textDecoration: "none" }}>View all</Link>
                  </div>
                  {apps.slice(0, 4).map(app => (
                    <div key={app._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.55rem 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <p style={{ color: "var(--text)", fontSize: "0.85rem", fontWeight: 600 }}>{app.internshipId?.title}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{app.internshipId?.company}</p>
                      </div>
                      <span className={`badge ${statusBadge[app.status]}`}>{app.status}</span>
                    </div>
                  ))}
                  {apps.length === 0 && <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>No applications yet.</p>}
                </div>

                {/* Top 5 leaderboard preview */}
                <div className="card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem" }}>
                    <h3 style={{ color: "var(--text)", fontWeight: 700 }}>🏆 Top Interns</h3>
                    <Link to="/leaderboard" style={{ color: "var(--accent)", fontSize: "0.8rem", textDecoration: "none" }}>Full board</Link>
                  </div>
                  <Leaderboard scores={topScores} currentUserId={user?._id} />
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.85rem" }}>
                {[
                  { to: "/internships", icon: Briefcase, label: "Browse Internships", color: "var(--accent)" },
                  { to: "/my-applications", icon: FileText, label: "My Applications", color: "#10b981" },
                  { to: "/my-score", icon: Star, label: "My Score", color: "#f59e0b" },
                  { to: "/leaderboard", icon: Trophy, label: "Leaderboard", color: "#ec4899" },
                ].map(({ to, icon: Icon, label, color }) => (
                  <Link key={to} to={to} className="card" style={{ padding: "1rem", textAlign: "center", textDecoration: "none", transition: "transform 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem" }}>
                      <Icon size={18} color={color} />
                    </div>
                    <p style={{ color: "var(--text)", fontSize: "0.82rem", fontWeight: 600 }}>{label}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
