import { useEffect, useState } from "react";
import { getLeaderboard } from "../../api/scoreApi";
import Leaderboard from "../../components/score/Leaderboard";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const StudentLeaderboardPage = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(r => setScores(r.data.data)).catch(() => toast.error("Failed to load.")).finally(() => setLoading(false));
  }, []);

  const myRank = scores.findIndex(s => s.studentId?._id === user?._id) + 1;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Leaderboard" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div className="animate-fadein" style={{ maxWidth: "52rem", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <h1 style={{ color: "var(--text)", fontWeight: 800, fontSize: "1.7rem" }}>🏆 Top Interns of the Month</h1>
              <p style={{ color: "var(--text-muted)", marginTop: "0.4rem" }}>Ranked by overall internship performance</p>
              {myRank > 0 && (
                <div style={{ marginTop: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", background: "var(--accent-glow)", border: "1px solid var(--accent)", borderRadius: "999px" }}>
                  <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem" }}>Your Rank: #{myRank}</span>
                </div>
              )}
            </div>
            {loading ? <LoadingSpinner /> : <Leaderboard scores={scores} currentUserId={user?._id} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLeaderboardPage;
