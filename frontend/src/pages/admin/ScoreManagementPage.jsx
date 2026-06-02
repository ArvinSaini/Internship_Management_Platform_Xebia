import { useEffect, useState } from "react";
import { getAllScores, assignScore } from "../../api/scoreApi";
import { getAllApplications } from "../../api/applicationApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ScoreCard from "../../components/score/ScoreCard";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Star, X } from "lucide-react";

const ScoreModal = ({ application, onClose, onSaved }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { skills: 0, attendance: 0, feedback: 0, taskCompletion: 0 },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await assignScore({
        studentId: application.studentId._id,
        applicationId: application._id,
        internshipId: application.internshipId._id,
        ...data,
      });
      toast.success("Score assigned!");
      onSaved();
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "24rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ color: "var(--text)", fontWeight: 700 }}>Assign Score</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{application.studentId?.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {[
            { name: "skills", label: "Skills (0–100)" },
            { name: "attendance", label: "Attendance (0–100)" },
            { name: "feedback", label: "Feedback (0–100)" },
            { name: "taskCompletion", label: "Task Completion (0–100)" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
              <input id={`score-${name}`} type="number" min="0" max="100" className="input-field" {...register(name, { min: 0, max: 100 })} />
            </div>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "0.6rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={loading} id="save-score" className="btn-primary" style={{ flex: 1 }}>
              {loading ? "Saving..." : "Save Score"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ScoreManagementPage = () => {
  const [scores, setScores] = useState([]);
  const [completedApps, setCompletedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scoreModal, setScoreModal] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [scoresRes, appsRes] = await Promise.all([getAllScores(), getAllApplications({ status: "Completed" })]);
      setScores(scoresRes.data.data);
      setCompletedApps(appsRes.data.data);
    } catch { toast.error("Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Score Management" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <LoadingSpinner /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fadein">
              {/* Completed apps awaiting score */}
              {completedApps.filter(a => !scores.find(s => s.applicationId?._id === a._id || s.applicationId === a._id)).length > 0 && (
                <div>
                  <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "0.75rem" }}>Completed — Awaiting Score</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {completedApps.filter(a => !scores.find(s => s.applicationId?._id === a._id || s.applicationId === a._id)).map(app => (
                      <div key={app._id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                        <div>
                          <p style={{ color: "var(--text)", fontWeight: 600 }}>{app.studentId?.name}</p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{app.internshipId?.title} @ {app.internshipId?.company}</p>
                        </div>
                        <button id={`assign-score-${app._id}`} onClick={() => setScoreModal(app)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", padding: "0.45rem 0.9rem" }}>
                          <Star size={14} /> Assign Score
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned scores */}
              <div>
                <h2 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "0.75rem" }}>Assigned Scores</h2>
                {scores.length === 0
                  ? <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>No scores assigned yet.</p>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                      {scores.map(s => <ScoreCard key={s._id} score={s} />)}
                    </div>
                }
              </div>
            </div>
          )}
        </main>
      </div>
      {scoreModal && <ScoreModal application={scoreModal} onClose={() => setScoreModal(null)} onSaved={fetchAll} />}
    </div>
  );
};

export default ScoreManagementPage;
