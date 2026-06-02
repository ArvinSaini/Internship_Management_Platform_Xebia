import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Briefcase, Sun, Moon, Github } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === "Admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "1.5rem 1rem",
      position: "relative",
    }}>
      {/* Background gradient blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10rem", left: "-10rem", width: "35rem", height: "35rem", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-8rem", right: "-8rem", width: "28rem", height: "28rem", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* Theme Toggle */}
      <div style={{ position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 10 }}>
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            width: "2.5rem", height: "2.5rem",
            borderRadius: "50%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Main Card */}
      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "23rem", padding: "2.25rem", position: "relative", zIndex: 1 }}>
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "3.75rem", height: "3.75rem",
            background: "var(--accent)",
            borderRadius: "1.1rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 0 28px var(--accent-glow)",
          }}>
            <Briefcase size={24} color="#fff" />
          </div>
          <h1 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.3rem", lineHeight: 1.3 }}>
            Internship Management Portal
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.35rem" }}>
            Sign in to continue to your portal
          </p>
        </div>

        {/* Form */}
        <form id="login-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              className={`input-field${errors.email ? " error" : ""}`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className={`input-field${errors.password ? " error" : ""}`}
                style={{ paddingRight: "2.75rem" }}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.password.message}</p>}
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            {loading
              ? <div style={{ width: "1.1rem", height: "1.1rem", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
              : "Sign In →"
            }
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.83rem", marginTop: "1.25rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
        </p>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "1.75rem", color: "var(--text-faint)", fontSize: "0.95rem", zIndex: 1, textAlign: "center" }}>
        Made with <span style={{ color: "#ef4444" }}>♥</span> by{" "}
        <a
          href="https://arvinsaini.tech"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
        >
          Arvin Saini
        </a>
      </p>
      <a
        href="https://github.com/ArvinSaini/Internship_Management_Platform_Xebia"
        target="_blank"
        rel="noreferrer"
        id="github-repo-link"
        title="View on GitHub"
        style={{
          marginTop: "0.5rem",
          color: "var(--text-faint)",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          fontSize: "0.82rem",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-faint)"}
      >
        <Github size={16} />
        View on GitHub
      </a>
    </div>
  );
};

export default LoginPage;
