import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/applicationApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { MapPin, Clock, Banknote } from "lucide-react";
import toast from "react-hot-toast";

const statusBadge = {
  "Pending": "badge-warning", "Under Review": "badge-info",
  "Selected": "badge-success", "Rejected": "badge-danger", "Completed": "badge-accent",
};

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getMyApplications().then(r => setApps(r.data.data)).catch(() => toast.error("Failed to load.")).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? apps.filter(a => a.status === filter) : apps;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="My Applications" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {["", "Pending", "Under Review", "Selected", "Rejected", "Completed"].map(f => (
              <button key={f || "all"} id={`filter-${f || "all"}`} onClick={() => setFilter(f)}
                style={{ padding: "0.4rem 0.85rem", borderRadius: "0.6rem", border: "1px solid var(--border)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: filter === f ? "var(--accent)" : "var(--surface)", color: filter === f ? "#fff" : "var(--text-muted)" }}>
                {f || "All"}
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : filtered.length === 0
            ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>No applications in this category.</p>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }} className="animate-fadein">
                {filtered.map(app => (
                  <div key={app._id} className="card" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                          <h3 style={{ color: "var(--text)", fontWeight: 700, fontSize: "1rem" }}>{app.internshipId?.title}</h3>
                          <span className={`badge ${statusBadge[app.status]}`}>{app.status}</span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: "0.86rem", marginBottom: "0.4rem" }}>{app.internshipId?.company}</p>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                          {[
                            { icon: MapPin, text: app.internshipId?.location },
                            { icon: Clock, text: app.internshipId?.duration },
                            { icon: Banknote, text: app.internshipId?.stipend > 0 ? `₹${app.internshipId.stipend.toLocaleString()}/mo` : "Unpaid" },
                          ].map(({ icon: Icon, text }) => text && (
                            <span key={text} style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                              <Icon size={13} /> {text}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ color: "var(--text-faint)", fontSize: "0.75rem" }}>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                        {app.remarks && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.4rem", maxWidth: "18rem" }}>Remark: {app.remarks}</p>}
                      </div>
                    </div>
                    {app.coverLetter && (
                      <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.85rem", background: "var(--surface-2)", borderRadius: "0.6rem" }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>"{app.coverLetter}"</p>
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

export default MyApplications;
