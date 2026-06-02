const gradeColor = { A: "var(--success)", B: "var(--info)", C: "var(--warning)", D: "var(--danger)", "N/A": "var(--text-faint)" };

const ScoreBar = ({ label, value }) => (
  <div style={{ marginBottom: "0.6rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
      <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{label}</span>
      <span style={{ color: "var(--text)", fontSize: "0.78rem", fontWeight: 600 }}>{value}/100</span>
    </div>
    <div style={{ height: "6px", background: "var(--surface-2)", borderRadius: "999px", overflow: "hidden" }}>
      <div
        style={{
          height: "100%", width: `${value}%`,
          background: value >= 80 ? "var(--success)" : value >= 60 ? "var(--info)" : value >= 40 ? "var(--warning)" : "var(--danger)",
          borderRadius: "999px",
          transition: "width 1s ease",
        }}
      />
    </div>
  </div>
);

const ScoreCard = ({ score }) => {
  if (!score) return null;
  return (
    <div className="card animate-fadein" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <p style={{ color: "var(--text)", fontWeight: 700 }}>{score.internshipId?.title}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{score.internshipId?.company}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: gradeColor[score.grade] }}>{score.grade}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Grade</div>
        </div>
      </div>

      {/* Score Bars */}
      <ScoreBar label="Skills" value={score.skills} />
      <ScoreBar label="Attendance" value={score.attendance} />
      <ScoreBar label="Feedback" value={score.feedback} />
      <ScoreBar label="Task Completion" value={score.taskCompletion} />

      {/* Total */}
      <div style={{
        marginTop: "1rem", padding: "0.75rem 1rem",
        background: "var(--surface-2)", borderRadius: "0.75rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Total Score</span>
        <span style={{ color: gradeColor[score.grade], fontWeight: 800, fontSize: "1.1rem" }}>{score.totalScore}/100</span>
      </div>
    </div>
  );
};

export default ScoreCard;
