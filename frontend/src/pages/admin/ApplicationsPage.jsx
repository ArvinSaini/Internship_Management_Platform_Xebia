import { useEffect, useState } from "react";
import { getAllApplications, updateApplicationStatus } from "../../api/applicationApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const statusBadge = {
  "Pending": "badge-warning", "Under Review": "badge-info",
  "Selected": "badge-success", "Rejected": "badge-danger", "Completed": "badge-accent",
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [remarks, setRemarks] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try { const r = await getAllApplications(filter ? { status: filter } : {}); setApplications(r.data.data); }
    catch { toast.error("Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filter]);

  const updateStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await updateApplicationStatus(id, { status, remarks: remarks[id] || "" });
      toast.success(`Application ${status}.`);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setActionLoading(null); }
  };

  const filters = ["", "Pending", "Under Review", "Selected", "Rejected", "Completed"];

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Applications Management" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {filters.map(f => (
              <button key={f || "all"} id={`filter-${f || "all"}`} onClick={() => setFilter(f)}
                style={{ padding: "0.4rem 0.9rem", borderRadius: "0.6rem", border: "1px solid var(--border)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: filter === f ? "var(--accent)" : "var(--surface)", color: filter === f ? "#fff" : "var(--text-muted)" }}>
                {f || "All"}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : applications.length === 0
            ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>No applications found.</p>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }} className="animate-fadein">
                {applications.map(app => (
                  <div key={app._id} className="card" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      {/* Student */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1 }}>
                        <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {app.studentId?.profilePicture ? <img src={app.studentId.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>{app.studentId?.name?.charAt(0)}</span>}
                        </div>
                        <div>
                          <p style={{ color: "var(--text)", fontWeight: 600 }}>{app.studentId?.name}</p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{app.studentId?.email}</p>
                        </div>
                      </div>
                      {/* Internship */}
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>{app.internshipId?.title}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{app.internshipId?.company}</p>
                      </div>
                      {/* Status + Date */}
                      <div style={{ textAlign: "right" }}>
                        <span className={`badge ${statusBadge[app.status]}`}>{app.status}</span>
                        <p style={{ color: "var(--text-faint)", fontSize: "0.72rem", marginTop: "0.25rem" }}>{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Cover letter */}
                    {app.coverLetter && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", background: "var(--surface-2)", borderRadius: "0.5rem", padding: "0.6rem 0.75rem", marginBottom: "0.75rem" }}>{app.coverLetter}</p>}

                    {/* Action buttons */}
                    {(app.status === "Pending" || app.status === "Under Review") && (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <input type="text" placeholder="Remarks (optional)..." className="input-field" style={{ flex: 1, padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
                          value={remarks[app._id] || ""} onChange={e => setRemarks(r => ({ ...r, [app._id]: e.target.value }))} id={`remarks-${app._id}`} />
                        {[
                          { s: "Under Review", label: "Review", color: "var(--info)", bg: "rgba(59,130,246,0.1)" },
                          { s: "Selected", label: "Select ✓", color: "var(--success)", bg: "rgba(16,185,129,0.1)" },
                          { s: "Rejected", label: "Reject ✗", color: "var(--danger)", bg: "rgba(239,68,68,0.1)" },
                          { s: "Completed", label: "Complete", color: "var(--accent)", bg: "var(--accent-glow)" },
                        ].map(({ s, label, color, bg }) => (
                          <button key={s} id={`${s.replace(" ", "-")}-${app._id}`}
                            onClick={() => updateStatus(app._id, s)}
                            disabled={actionLoading === app._id + s}
                            style={{ padding: "0.45rem 0.9rem", borderRadius: "0.6rem", border: `1px solid ${color}44`, background: bg, color, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                            {actionLoading === app._id + s ? "..." : label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          }
        </main>
      </div>
    </div>
  );
};

export default ApplicationsPage;
