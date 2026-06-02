import { useEffect, useState } from "react";
import { getMyScore } from "../../api/scoreApi";
import ScoreCard from "../../components/score/ScoreCard";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const MyScorePage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyScore().then(r => setScores(r.data.data)).catch(() => toast.error("Failed to load.")).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="My Score" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <LoadingSpinner /> : scores.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>
              <Star size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text)", fontWeight: 700, marginBottom: "0.5rem" }}>No Scores Yet</h3>
              <p>Complete an internship and your score will appear here.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }} className="animate-fadein">
              {scores.map(s => <ScoreCard key={s._id} score={s} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyScorePage;
