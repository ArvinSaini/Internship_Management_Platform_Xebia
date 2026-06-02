import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

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

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "1rem",
    }}>
      {/* Background gradient blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10rem", left: "-10rem", width: "35rem", height: "35rem", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10rem", right: "-10rem", width: "30rem", height: "30rem", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "22rem", padding: "2rem", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{
            width: "3.5rem", height: "3.5rem", background: "var(--accent)",
            borderRadius: "1rem", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 0.75rem",
            boxShadow: "0 0 24px var(--accent-glow)",
          }}>
            <Briefcase size={22} color="#fff" />
          </div>
          <h1 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.4rem" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Sign in to your account</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>Email Address</label>
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
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>Password</label>
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
                onClick={() => setShowPwd((p) => !p)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.password.message}</p>}
          </div>

          <button id="login-submit" type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            {loading ? <div style={{ width: "1.1rem", height: "1.1rem", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} /> : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.83rem", marginTop: "1.25rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
