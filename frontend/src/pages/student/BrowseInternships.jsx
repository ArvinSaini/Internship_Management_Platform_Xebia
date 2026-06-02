import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { getAllInternships } from "../../api/internshipApi";
import { getMyApplications, applyToInternship } from "../../api/applicationApi";
import InternshipCard from "../../components/internship/InternshipCard";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const ApplyModal = ({ internship, onClose, onApplied }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyToInternship({ internshipId: internship._id, coverLetter });
      toast.success(`Applied to ${internship.title}!`);
      onApplied();
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to apply."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "26rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ color: "var(--text)", fontWeight: 700 }}>Apply Now</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{internship.title} at {internship.company}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem" }}>Cover Letter (optional)</label>
          <textarea
            id="cover-letter"
            rows={5}
            className="input-field"
            placeholder="Briefly describe why you're a great fit..."
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
          <button id="confirm-apply" onClick={handleApply} disabled={loading} className="btn-primary" style={{ flex: 1 }}>
            {loading ? "Applying..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

const BrowseInternships = () => {
  const [internships, setInternships] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [applyTarget, setApplyTarget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intRes, appRes] = await Promise.all([getAllInternships({ search, type }), getMyApplications()]);
      setInternships(intRes.data.data);
      setAppliedIds(new Set(appRes.data.data.map(a => a.internshipId?._id)));
    } catch { toast.error("Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Browse Internships" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Search & Filter */}
          <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} style={{ display: "flex", gap: "0.65rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "14rem" }}>
              <Search size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
              <input id="intern-search" type="text" placeholder="Search by title, company, skill..." value={search} onChange={e => setSearch(e.target.value)} className="input-field" style={{ paddingLeft: "2.25rem" }} />
            </div>
            <select id="type-filter" value={type} onChange={e => setType(e.target.value)} className="input-field" style={{ width: "auto", minWidth: "8rem" }}>
              <option value="">All Types</option>
              <option>Remote</option><option>Onsite</option><option>Hybrid</option>
            </select>
            <button type="submit" className="btn-primary" style={{ padding: "0.5rem 1.25rem" }}>Search</button>
          </form>

          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1rem" }}>
            {internships.length} internship{internships.length !== 1 ? "s" : ""} found
          </p>

          {loading ? <LoadingSpinner /> : internships.length === 0
            ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>No internships found.</p>
            : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }} className="animate-fadein">
                {internships.map(i => (
                  <InternshipCard key={i._id} internship={i} applied={appliedIds.has(i._id)} onApply={() => setApplyTarget(i)} />
                ))}
              </div>
            )
          }
        </main>
      </div>
      {applyTarget && <ApplyModal internship={applyTarget} onClose={() => setApplyTarget(null)} onApplied={fetchData} />}
    </div>
  );
};

export default BrowseInternships;
