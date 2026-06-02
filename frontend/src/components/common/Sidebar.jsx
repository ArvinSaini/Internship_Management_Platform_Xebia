import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, FileText, Users, Trophy,
  Star, LogOut, ChevronLeft, ChevronRight, Bell, User,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { logoutUser } from "../../api/authApi";
import toast from "react-hot-toast";

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/internships", icon: Briefcase, label: "Internships" },
  { to: "/admin/applications", icon: FileText, label: "Applications" },
  { to: "/admin/scores", icon: Star, label: "Score Management" },
  { to: "/admin/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/profile", icon: User, label: "My Profile" },
];

const studentLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/internships", icon: Briefcase, label: "Browse Internships" },
  { to: "/my-applications", icon: FileText, label: "My Applications" },
  { to: "/my-score", icon: Star, label: "My Score" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "My Profile" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = user?.role === "Admin" ? adminLinks : studentLinks;

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    navigate("/login");
    toast.success("Logged out.");
  };

  return (
    <aside
      style={{
        width: collapsed ? "4.5rem" : "14rem",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ width: "2rem", height: "2rem", background: "var(--accent)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Briefcase size={14} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.2 }}>
            Internship<br />Platform
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid var(--border)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", marginBottom: "0.25rem" }}>
            <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--accent-glow)", border: "1px solid var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {user?.profilePicture
                ? <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.8rem" }}>{user?.name?.charAt(0)}</span>
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "var(--text)", fontSize: "0.8rem", fontWeight: 600, truncate: true, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{user?.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{user?.role}</p>
            </div>
          </div>
        )}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: "100%", background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        id="sidebar-toggle"
        onClick={() => setCollapsed((p) => !p)}
        style={{
          position: "absolute", top: "50%", right: "-0.75rem",
          transform: "translateY(-50%)",
          width: "1.5rem", height: "1.5rem",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", color: "var(--text-muted)",
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
