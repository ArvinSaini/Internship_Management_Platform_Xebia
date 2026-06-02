import { Sun, Moon, User } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const profilePath = user?.role === "Admin" ? "#" : "/profile";

  return (
    <header
      style={{
        height: "3.75rem",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <h1 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700 }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            width: "2.25rem", height: "2.25rem",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: "0.625rem", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer",
            color: "var(--text-muted)", transition: "all 0.2s",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Profile Link (students only) */}
        {user?.role === "Student" && (
          <Link
            to={profilePath}
            id="navbar-profile"
            style={{
              width: "2.25rem", height: "2.25rem",
              borderRadius: "50%", overflow: "hidden",
              border: "2px solid var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--accent-glow)",
            }}
          >
            {user?.profilePicture
              ? <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <User size={14} color="var(--accent)" />
            }
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
