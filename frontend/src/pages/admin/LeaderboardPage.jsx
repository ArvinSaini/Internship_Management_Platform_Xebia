import { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/scoreApi";
import Leaderboard from "../../components/score/Leaderboard";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const AdminLeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(r => setScores(r.data.data)).catch(() => toast.error("Failed to load.")).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Leaderboard" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div className="animate-fadein" style={{ maxWidth: "52rem", margin: "0 auto" }}>
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <h1 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.6rem" }}>🏆 Top Interns</h1>
              <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Ranked by overall internship performance score</p>
            </div>
            {loading ? <LoadingSpinner /> : <Leaderboard scores={scores} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLeaderboardPage;
