import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead, markAllRead } from "../../api/studentApi";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const typeColor = { success: "var(--success)", info: "var(--info)", warning: "var(--warning)", error: "var(--danger)" };

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => getNotifications().then(r => setNotifications(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(n => n.map(x => x._id === id ? { ...x, isRead: true } : x));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
    toast.success("All marked as read.");
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Navbar title="Notifications" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ color: "var(--text)", fontWeight: 700 }}>Notifications</h2>
                {unread > 0 && <span className="badge badge-accent" style={{ marginTop: "0.3rem" }}>{unread} unread</span>}
              </div>
              {unread > 0 && (
                <button id="mark-all-read" onClick={handleMarkAll} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", borderRadius: "0.6rem", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem" }}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            {loading ? <LoadingSpinner /> : notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                <Bell size={40} style={{ opacity: 0.2, marginBottom: "0.75rem" }} />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }} className="animate-fadein">
                {notifications.map(n => (
                  <div key={n._id} className="card" style={{ padding: "1rem", opacity: n.isRead ? 0.6 : 1, borderLeft: `3px solid ${typeColor[n.type]}`, cursor: n.isRead ? "default" : "pointer" }}
                    onClick={() => !n.isRead && handleMarkRead(n._id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.88rem" }}>{n.title}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{n.message}</p>
                      </div>
                      {!n.isRead && <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: "0.35rem" }} />}
                    </div>
                    <p style={{ color: "var(--text-faint)", fontSize: "0.72rem", marginTop: "0.5rem" }}>{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
