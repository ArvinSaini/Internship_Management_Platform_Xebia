import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Briefcase, Upload, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { registerStudent } from "../../api/authApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      if (data.profilePicture?.[0]) formData.append("profilePicture", data.profilePicture[0]);
      await registerStudent(formData);
      toast.success("Registration submitted! Awaiting admin approval.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, name, type = "text", placeholder, rules }) => (
    <div>
      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} className={`input-field${errors[name] ? " error" : ""}`} {...register(name, rules)} />
      {errors[name] && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors[name].message}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "2rem 1rem" }}>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10rem", right: "-10rem", width: "35rem", height: "35rem", background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "26rem", padding: "2rem", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "3.5rem", height: "3.5rem", background: "var(--accent)", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", boxShadow: "0 0 24px var(--accent-glow)" }}>
            <Briefcase size={22} color="#fff" />
          </div>
          <h1 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.4rem" }}>Create Account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Join the internship platform</p>
        </div>

        {/* Avatar upload */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <label htmlFor="profilePicture" style={{ cursor: "pointer", position: "relative" }}>
            <div style={{ width: "5rem", height: "5rem", borderRadius: "50%", border: "2px dashed var(--accent)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)" }}>
              {preview
                ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Upload size={22} color="var(--accent)" />
              }
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "1.5rem", height: "1.5rem", background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={10} color="#fff" />
            </div>
          </label>
          <input id="profilePicture" type="file" accept="image/*" className="hidden" style={{ display: "none" }} {...register("profilePicture")} onChange={handleFileChange} />
        </div>

        <form id="register-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <Field id="reg-name" label="Full Name" name="name" placeholder="Arvin Saini" rules={{ required: "Name is required" }} />
          <Field id="reg-email" label="Email Address" name="email" type="email" placeholder="you@example.com" rules={{ 
            required: "Email is required", 
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } 
          }} />
          <Field id="reg-phone" label="Phone Number" name="phone" type="tel" placeholder="9876543210" rules={{ 
            required: "Phone is required",
            pattern: { value: /^\d{10}$/, message: "Phone must be exactly 10 digits" }
          }} />

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input id="reg-password" type={showPwd ? "text" : "password"} placeholder="Min 6 characters" className={`input-field${errors.password ? " error" : ""}`} style={{ paddingRight: "2.75rem" }}
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
              <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.password.message}</p>}
          </div>

          <div>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>Confirm Password</label>
            <input id="reg-confirm" type="password" placeholder="Re-enter password" className={`input-field${errors.confirmPassword ? " error" : ""}`}
              {...register("confirmPassword", { required: "Please confirm password", validate: v => v === password || "Passwords do not match" })} />
            {errors.confirmPassword && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.confirmPassword.message}</p>}
          </div>

          <button id="register-submit" type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            {loading ? <div style={{ width: "1.1rem", height: "1.1rem", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} /> : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.83rem", marginTop: "1.25rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
