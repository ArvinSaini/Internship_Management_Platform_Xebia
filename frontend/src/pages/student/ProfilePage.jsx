import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getProfile, updateProfile, changePassword, updateProfilePicture, uploadResume } from "../../api/studentApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import { Upload, Camera, FileText } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, watch, formState: { errors: pwdErrors } } = useForm();
  const newPwd = watch("newPassword");

  useEffect(() => {
    getProfile().then(r => {
      setProfile(r.data.data);
      reset({ name: r.data.data.name, phone: r.data.data.phone, bio: r.data.data.bio, skills: r.data.data.skills?.join(", "), education: r.data.data.education });
    }).catch(() => toast.error("Failed to load.")).finally(() => setLoading(false));
  }, []);

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const r = await updateProfile({ ...data, skills: data.skills?.split(",").map(s => s.trim()).filter(Boolean), education: typeof data.education === "string" ? JSON.parse(data.education) : data.education });
      setProfile(r.data.data); updateUser(r.data.data);
      toast.success("Profile updated!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setSaving(false); }
  };

  const onChangePassword = async (data) => {
    setSaving(true);
    try { await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }); toast.success("Password changed!"); resetPwd(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setSaving(false); }
  };

  const onUploadPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append("profilePicture", file);
    try { const r = await updateProfilePicture(fd); setProfile(r.data.data); updateUser(r.data.data); toast.success("Picture updated!"); }
    catch { toast.error("Failed to update picture."); }
  };

  const onUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append("resume", file);
    try { const r = await uploadResume(fd); setProfile(r.data.data); toast.success("Resume uploaded!"); }
    catch { toast.error("Failed to upload resume."); }
  };

  const tabs = [{ key: "profile", label: "Profile" }, { key: "password", label: "Password" }, { key: "resume", label: "Resume" }];

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="My Profile" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <LoadingSpinner /> : (
            <div style={{ maxWidth: "38rem", margin: "0 auto" }} className="animate-fadein">
              {/* Avatar */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <div style={{ width: "6rem", height: "6rem", borderRadius: "50%", overflow: "hidden", border: "3px solid var(--accent)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {profile?.profilePicture ? <img src={profile.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>{profile?.name?.charAt(0)}</span>}
                  </div>
                  <label htmlFor="avatar-upload" style={{ position: "absolute", bottom: 0, right: 0, width: "1.75rem", height: "1.75rem", background: "var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Camera size={12} color="#fff" />
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={onUploadPicture} />
                </div>
                <h2 style={{ color: "var(--text)", fontWeight: 700, marginTop: "0.75rem" }}>{profile?.name}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{profile?.email}</p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", background: "var(--surface)", padding: "0.25rem", borderRadius: "0.875rem", border: "1px solid var(--border)" }}>
                {tabs.map(t => (
                  <button key={t.key} id={`tab-${t.key}`} onClick={() => setTab(t.key)}
                    style={{ flex: 1, padding: "0.5rem", borderRadius: "0.65rem", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s", background: tab === t.key ? "var(--accent)" : "transparent", color: tab === t.key ? "#fff" : "var(--text-muted)" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Profile Tab */}
              {tab === "profile" && (
                <div className="card" style={{ padding: "1.5rem" }}>
                  <form id="profile-form" onSubmit={handleSubmit(onSaveProfile)} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {[{ id: "p-name", label: "Full Name", name: "name", rules: { required: "Required" } }, { id: "p-phone", label: "Phone", name: "phone" }].map(f => (
                      <div key={f.name}>
                        <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>{f.label}</label>
                        <input id={f.id} className="input-field" {...register(f.name, f.rules)} />
                        {errors[f.name] && <p style={{ color: "var(--danger)", fontSize: "0.73rem", marginTop: "0.2rem" }}>{errors[f.name].message}</p>}
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>Bio</label>
                      <textarea id="p-bio" rows={3} className="input-field" placeholder="Tell us about yourself..." style={{ resize: "vertical" }} {...register("bio")} />
                    </div>
                    <div>
                      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>Skills (comma-separated)</label>
                      <input id="p-skills" className="input-field" placeholder="React, Node.js, Python..." {...register("skills")} />
                    </div>
                    <button id="save-profile" type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Profile"}</button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {tab === "password" && (
                <div className="card" style={{ padding: "1.5rem" }}>
                  <form id="password-form" onSubmit={handlePwd(onChangePassword)} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                    {[{ id: "pwd-current", label: "Current Password", name: "currentPassword", rules: { required: "Required" } },
                      { id: "pwd-new", label: "New Password", name: "newPassword", rules: { required: "Required", minLength: { value: 6, message: "Min 6 chars" } } },
                      { id: "pwd-confirm", label: "Confirm New Password", name: "confirmPassword", rules: { required: "Required", validate: v => v === newPwd || "Passwords don't match" } }
                    ].map(f => (
                      <div key={f.name}>
                        <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem" }}>{f.label}</label>
                        <input id={f.id} type="password" className={`input-field${pwdErrors[f.name] ? " error" : ""}`} {...regPwd(f.name, f.rules)} />
                        {pwdErrors[f.name] && <p style={{ color: "var(--danger)", fontSize: "0.73rem", marginTop: "0.2rem" }}>{pwdErrors[f.name].message}</p>}
                      </div>
                    ))}
                    <button id="save-password" type="submit" disabled={saving} className="btn-primary">{saving ? "Updating..." : "Change Password"}</button>
                  </form>
                </div>
              )}

              {/* Resume Tab */}
              {tab === "resume" && (
                <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
                  <FileText size={40} style={{ color: "var(--accent)", marginBottom: "1rem" }} />
                  <h3 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "0.5rem" }}>Your Resume</h3>
                  {profile?.resumeUrl ? (
                    <div style={{ marginBottom: "1.25rem" }}>
                      <a id="view-resume" href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>View Current Resume →</a>
                    </div>
                  ) : <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>No resume uploaded yet.</p>}
                  <label htmlFor="resume-upload" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.75rem", background: "var(--accent)", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                    <Upload size={16} /> Upload PDF Resume
                  </label>
                  <input id="resume-upload" type="file" accept=".pdf" style={{ display: "none" }} onChange={onUploadResume} />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
