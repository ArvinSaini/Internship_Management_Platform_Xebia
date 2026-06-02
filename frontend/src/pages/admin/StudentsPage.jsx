import { useEffect, useState } from "react";
import { Search, UserCheck, UserX, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { getAllStudents, getPendingStudents, approveStudent, rejectStudent, toggleAccountStatus, deleteStudent } from "../../api/adminApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const ApprovalBadge = ({ status }) => {
  const map = {
    Approved: "badge-success", Pending: "badge-warning", Rejected: "badge-danger",
  };
  return <span className={`badge ${map[status]}`}>{status}</span>;
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchStudents = async (q = "") => {
    setLoading(true);
    try {
      const res = filter === "pending"
        ? await getPendingStudents()
        : await getAllStudents(q);
      setStudents(res.data.data);
    } catch { toast.error("Failed to load students."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(search); }, [filter]);

  const act = async (id, fn, msg) => {
    setActionLoading(id);
    try { await fn(id); toast.success(msg); fetchStudents(search); }
    catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setActionLoading(null); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Student Management" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {[["all", "All"], ["pending", "Pending"]].map(([key, label]) => (
                <button key={key} id={`filter-${key}`} onClick={() => setFilter(key)}
                  style={{ padding: "0.45rem 1rem", borderRadius: "0.625rem", border: "1px solid var(--border)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", background: filter === key ? "var(--accent)" : "var(--surface)", color: filter === key ? "#fff" : "var(--text-muted)" }}>
                  {label}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); fetchStudents(search); }} style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
              <div style={{ position: "relative", flex: 1, maxWidth: "22rem" }}>
                <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
                <input id="student-search" type="text" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: "2.25rem" }} />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>Search</button>
            </form>
          </div>

          {loading ? <LoadingSpinner /> : students.length === 0
            ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>No students found.</p>
            : (
              <div className="card animate-fadein" style={{ overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Student", "Phone", "Approval", "Account", "Actions"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "0.75rem 1rem", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s._id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                              <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {s.profilePicture ? <img src={s.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>{s.name?.charAt(0)}</span>}
                              </div>
                              <div>
                                <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.88rem" }}>{s.name}</p>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.76rem" }}>{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", fontSize: "0.84rem" }}>{s.phone}</td>
                          <td style={{ padding: "0.85rem 1rem" }}><ApprovalBadge status={s.approvalStatus} /></td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <span className={`badge ${s.accountStatus === "Active" ? "badge-success" : "badge-danger"}`}>{s.accountStatus}</span>
                          </td>
                          <td style={{ padding: "0.85rem 1rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              {s.approvalStatus === "Pending" && <>
                                <button id={`approve-${s._id}`} onClick={() => act(s._id, approveStudent, "Approved!")}
                                  disabled={actionLoading === s._id}
                                  style={{ padding: "0.35rem 0.75rem", borderRadius: "0.5rem", border: "none", background: "rgba(16,185,129,0.15)", color: "var(--success)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
                                  <CheckCircle size={13} style={{ marginRight: "0.3rem", display: "inline" }} />Approve
                                </button>
                                <button id={`reject-${s._id}`} onClick={() => act(s._id, rejectStudent, "Rejected.")}
                                  disabled={actionLoading === s._id}
                                  style={{ padding: "0.35rem 0.75rem", borderRadius: "0.5rem", border: "none", background: "rgba(239,68,68,0.1)", color: "var(--danger)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
                                  <XCircle size={13} style={{ marginRight: "0.3rem", display: "inline" }} />Reject
                                </button>
                              </>}
                              <button id={`toggle-${s._id}`} onClick={() => act(s._id, toggleAccountStatus, "Status updated.")}
                                disabled={actionLoading === s._id}
                                style={{ padding: "0.35rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.78rem" }}>
                                {s.accountStatus === "Active" ? <UserX size={13} /> : <UserCheck size={13} />}
                              </button>
                              <button id={`delete-${s._id}`} onClick={() => { if (window.confirm("Delete this student?")) act(s._id, deleteStudent, "Deleted."); }}
                                disabled={actionLoading === s._id}
                                style={{ padding: "0.35rem 0.5rem", borderRadius: "0.5rem", border: "none", background: "rgba(239,68,68,0.1)", color: "var(--danger)", cursor: "pointer" }}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        </main>
      </div>
    </div>
  );
};

export default StudentsPage;
