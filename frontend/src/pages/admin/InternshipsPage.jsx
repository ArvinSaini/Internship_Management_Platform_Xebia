import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { getAllInternships, createInternship, updateInternship, deleteInternship, toggleInternshipStatus } from "../../api/internshipApi";
import InternshipCard from "../../components/internship/InternshipCard";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const InternshipFormModal = ({ existing, onClose, onSaved }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: existing ? {
      ...existing,
      skills: existing.skills?.join(", "),
      deadline: existing.deadline?.slice(0, 10),
    } : {},
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, skills: data.skills?.split(",").map(s => s.trim()).filter(Boolean), stipend: Number(data.stipend), openings: Number(data.openings) };
      if (existing) await updateInternship(existing._id, payload);
      else await createInternship(payload);
      toast.success(existing ? "Internship updated!" : "Internship created!");
      onSaved();
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); }
    finally { setLoading(false); }
  };

  const F = ({ id, label, name, type = "text", placeholder, rules, as: As = "input", children }) => (
    <div>
      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{label}</label>
      {As === "input"
        ? <input id={id} type={type} placeholder={placeholder} className={`input-field${errors[name] ? " error" : ""}`} {...register(name, rules)} />
        : <As id={id} className={`input-field${errors[name] ? " error" : ""}`} style={{ resize: "vertical" }} {...register(name, rules)}>{children}</As>
      }
      {errors[name] && <p style={{ color: "var(--danger)", fontSize: "0.73rem", marginTop: "0.2rem" }}>{errors[name].message}</p>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
      <div className="card animate-fadein" style={{ width: "100%", maxWidth: "30rem", padding: "1.5rem", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ color: "var(--text)", fontWeight: 700 }}>{existing ? "Edit Internship" : "Create Internship"}</h2>
          <button id="close-modal" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
        </div>
        <form id="internship-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <F id="title" label="Title" name="title" placeholder="Software Engineer Intern" rules={{ required: "Title required" }} />
          <F id="company" label="Company" name="company" placeholder="Acme Corp" rules={{ required: "Company required" }} />
          <F id="description" label="Description" name="description" as="textarea" placeholder="Internship description..." rules={{ required: "Description required" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <F id="location" label="Location" name="location" placeholder="New Delhi" rules={{ required: "Location required" }} />
            <div>
              <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Type</label>
              <select id="type" className="input-field" {...register("type")}>
                <option>Remote</option><option>Onsite</option><option>Hybrid</option>
              </select>
            </div>
            <F id="duration" label="Duration" name="duration" placeholder="3 months" rules={{ required: "Duration required" }} />
            <F id="stipend" label="Stipend (₹/mo)" name="stipend" type="number" placeholder="5000" />
            <F id="openings" label="Openings" name="openings" type="number" placeholder="5" />
            <F id="deadline" label="Deadline" name="deadline" type="date" rules={{ required: "Deadline required" }} />
          </div>
          <F id="skills" label="Skills (comma-separated)" name="skills" placeholder="React, Node.js, MongoDB" />
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
            <button id="save-internship" type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? "Saving..." : existing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try { const r = await getAllInternships({ status: "" }); setInternships(r.data.data); }
    catch { toast.error("Failed to load."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleToggle = async (id) => {
    try { await toggleInternshipStatus(id); toast.success("Status updated."); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    try { await deleteInternship(id); toast.success("Deleted."); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed."); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Internship Management" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
            <button id="create-internship-btn" onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={16} /> New Internship
            </button>
          </div>
          {loading ? <LoadingSpinner /> : internships.length === 0
            ? <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>No internships yet.</p>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }} className="animate-fadein">
                {internships.map(i => (
                  <InternshipCard key={i._id} internship={i} isAdmin showStatus
                    onToggle={handleToggle} onEdit={(i) => { setEditing(i); setShowModal(true); }} onDelete={handleDelete} />
                ))}
              </div>
          }
        </main>
      </div>
      {showModal && <InternshipFormModal existing={editing} onClose={() => setShowModal(false)} onSaved={fetch} />}
    </div>
  );
};

export default InternshipsPage;
