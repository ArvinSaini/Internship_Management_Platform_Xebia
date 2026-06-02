import { Trophy } from "lucide-react";

const medalColors = ["#f59e0b", "#94a3b8", "#b45309"];
const medalLabels = ["🥇", "🥈", "🥉"];

const gradeColor = { A: "var(--success)", B: "var(--info)", C: "var(--warning)", D: "var(--danger)", "N/A": "var(--text-faint)" };

const Leaderboard = ({ scores = [], currentUserId }) => {
  if (!scores.length) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
        <Trophy size={40} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
        <p>No scores yet. Complete an internship to appear here!</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {scores.map((entry, idx) => {
        const isMe = entry.studentId?._id === currentUserId;
        const isMedal = idx < 3;

        return (
          <div
            key={entry._id}
            className="card animate-fadein"
            style={{
              padding: "0.9rem 1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              border: isMe ? "1px solid var(--accent)" : undefined,
              background: isMe ? "var(--accent-glow)" : "var(--surface)",
              animationDelay: `${idx * 0.04}s`,
            }}
          >
            {/* Rank */}
            <div style={{ width: "2rem", textAlign: "center", flexShrink: 0 }}>
              {isMedal ? (
                <span style={{ fontSize: "1.3rem" }}>{medalLabels[idx]}</span>
              ) : (
                <span style={{ color: "var(--text-faint)", fontWeight: 700, fontSize: "0.9rem" }}>#{idx + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width: "2.4rem", height: "2.4rem", borderRadius: "50%",
              overflow: "hidden", flexShrink: 0,
              background: "var(--surface-2)",
              border: isMedal ? `2px solid ${medalColors[idx]}` : "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {entry.studentId?.profilePicture
                ? <img src={entry.studentId.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontWeight: 700, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {entry.studentId?.name?.charAt(0)}
                  </span>
              }
            </div>

            {/* Name + Internship */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.9rem" }}>
                {entry.studentId?.name}
                {isMe && <span style={{ marginLeft: "0.5rem", color: "var(--accent)", fontSize: "0.7rem" }}>(You)</span>}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {entry.internshipId?.title} @ {entry.internshipId?.company}
              </p>
            </div>

            {/* Score + Grade */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ color: gradeColor[entry.grade], fontWeight: 800, fontSize: "1.1rem" }}>{entry.totalScore}</p>
              <span className={`badge`} style={{
                background: "transparent",
                border: `1px solid ${gradeColor[entry.grade]}`,
                color: gradeColor[entry.grade], fontSize: "0.65rem"
              }}>{entry.grade}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;
