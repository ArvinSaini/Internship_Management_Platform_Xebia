const LoadingSpinner = ({ fullPage = false }) => {
  const spinner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: "2.5rem", height: "2.5rem",
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--accent)",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }}
      />
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)",
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
