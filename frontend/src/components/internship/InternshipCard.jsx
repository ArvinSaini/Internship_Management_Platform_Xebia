import { MapPin, Clock, Banknote, Users, Calendar, Wifi, Building2, Blend } from "lucide-react";

const typeIcon = { Remote: Wifi, Onsite: Building2, Hybrid: Blend };
const typeBadgeColor = {
  Remote: "badge-info",
  Onsite: "badge-success",
  Hybrid: "badge-accent",
};

const InternshipCard = ({ internship, onApply, applied, showStatus = false, onToggle, onEdit, onDelete, isAdmin = false }) => {
  const TypeIcon = typeIcon[internship.type] || Wifi;
  const isPast = new Date(internship.deadline) < new Date();

  return (
    <div className="card animate-fadein" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: "var(--text)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>{internship.title}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>{internship.company}</p>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
          <span className={`badge ${typeBadgeColor[internship.type]}`}>
            <TypeIcon size={10} style={{ marginRight: "0.3rem" }} />{internship.type}
          </span>
          {showStatus && (
            <span className={`badge ${internship.status === "Active" ? "badge-success" : "badge-neutral"}`}>
              {internship.status}
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
        {[
          { icon: MapPin, text: internship.location },
          { icon: Clock, text: internship.duration },
          { icon: Banknote, text: internship.stipend > 0 ? `₹${internship.stipend.toLocaleString()}/mo` : "Unpaid" },
          { icon: Users, text: `${internship.openings} opening${internship.openings !== 1 ? "s" : ""}` },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Icon size={13} color="var(--text-faint)" style={{ flexShrink: 0 }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Skills */}
      {internship.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {internship.skills.slice(0, 4).map((s) => (
            <span key={s} className="badge badge-neutral" style={{ fontSize: "0.68rem" }}>{s}</span>
          ))}
          {internship.skills.length > 4 && (
            <span className="badge badge-neutral" style={{ fontSize: "0.68rem" }}>+{internship.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Deadline */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Calendar size={12} color={isPast ? "var(--danger)" : "var(--text-faint)"} />
        <span style={{ fontSize: "0.75rem", color: isPast ? "var(--danger)" : "var(--text-muted)" }}>
          Deadline: {new Date(internship.deadline).toLocaleDateString()}
          {isPast && " (Closed)"}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        {!isAdmin && onApply && (
          <button
            id={`apply-${internship._id}`}
            onClick={() => onApply(internship)}
            disabled={applied || isPast || internship.status === "Closed"}
            className="btn-primary"
            style={{ flex: 1, fontSize: "0.85rem", padding: "0.5rem 1rem" }}
          >
            {applied ? "✓ Applied" : "Apply Now"}
          </button>
        )}

        {isAdmin && (
          <>
            <button
              id={`toggle-${internship._id}`}
              onClick={() => onToggle(internship._id)}
              style={{
                flex: 1, padding: "0.5rem", fontSize: "0.8rem", fontWeight: 600,
                borderRadius: "0.6rem", border: "1px solid var(--border)",
                background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer",
              }}
            >
              {internship.status === "Active" ? "Close" : "Reopen"}
            </button>
            <button
              id={`edit-${internship._id}`}
              onClick={() => onEdit(internship)}
              style={{
                flex: 1, padding: "0.5rem", fontSize: "0.8rem", fontWeight: 600,
                borderRadius: "0.6rem", border: "1px solid var(--accent)",
                background: "var(--accent-glow)", color: "var(--accent)", cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              id={`delete-${internship._id}`}
              onClick={() => onDelete(internship._id)}
              style={{
                padding: "0.5rem 0.75rem", fontSize: "0.8rem", fontWeight: 600,
                borderRadius: "0.6rem", border: "1px solid rgba(239,68,68,0.3)",
                background: "rgba(239,68,68,0.1)", color: "var(--danger)", cursor: "pointer",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;
