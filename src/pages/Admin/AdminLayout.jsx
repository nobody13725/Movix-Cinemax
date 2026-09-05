import React, { useState } from "react";
import AdminMovies from "./AdminMovies.jsx";
import AdminCinemas from "./AdminCinemas.jsx";
import AdminRooms from "./AdminRooms.jsx";
import AdminShowtimes from "./AdminShowtimes.jsx";
import AdminUsers from "./AdminUsers.jsx";
import AdminComments from "./AdminComments.jsx";
import AdminOrders from "./AdminOrders.jsx";
import AdminPromotions from "./AdminPromotions.jsx";
import AdminReports from "./AdminReports.jsx";
import AdminSupabase from "./AdminSupabase.jsx";

export default function AdminLayout({ user, onExitAdmin, go, goBack }) {
  const [activeTab, setActiveTab] = useState("movies");

  const handleExit = () => {
    if (typeof onExitAdmin === "function") {
      onExitAdmin();
    } else if (typeof go === "function") {
      go("home");
    } else if (typeof goBack === "function") {
      goBack();
    } else {
      window.history.back();
    }
  };

  const navItems = [
    { id: "movies", label: "Quản lý phim", icon: "🎬", uc: "UC12" },
    { id: "cinemas", label: "Quản lý rạp chiếu", icon: "🏢", uc: "UC13" },
    { id: "rooms", label: "Quản lý phòng chiếu", icon: "💺", uc: "UC14" },
    { id: "showtimes", label: "Quản lý suất chiếu", icon: "🕒", uc: "UC15" },
    { id: "users", label: "Quản lý thành viên", icon: "👥", uc: "UC16" },
    { id: "comments", label: "Quản lý bình luận", icon: "💬", uc: "UC17" },
    { id: "orders", label: "Quản lý đặt vé", icon: "🎟️", uc: "UC19" },
    { id: "promotions", label: "Quản lý khuyến mãi", icon: "🏷️", uc: "UC18" },
    { id: "reports", label: "Thống kê & báo cáo", icon: "📊", uc: "UC20" },
    { id: "supabase", label: "Cơ sở dữ liệu Supabase", icon: "⚡", uc: "DB" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "movies":
        return <AdminMovies />;
      case "cinemas":
        return <AdminCinemas />;
      case "rooms":
        return <AdminRooms />;
      case "showtimes":
        return <AdminShowtimes />;
      case "users":
        return <AdminUsers />;
      case "comments":
        return <AdminComments />;
      case "orders":
        return <AdminOrders />;
      case "promotions":
        return <AdminPromotions />;
      case "reports":
        return <AdminReports />;
      case "supabase":
        return <AdminSupabase />;
      default:
        return <AdminMovies />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar matching Fig 29-44 */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="brand-logo" style={{ color: "var(--brand-500)", fontWeight: 900, fontSize: 22 }}>
            MOVIX <span style={{ fontSize: 13, color: "var(--ink-500)", fontWeight: 500 }}>ADMIN</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              <span className="badge-uc">{item.uc}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="btn btn-secondary btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={handleExit}>
            ← Trang xem phim
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--ink-500)" }}>Bảng điều khiển quản trị /</span>
            <strong style={{ fontSize: 14, color: "var(--ink-900)" }}>
              {navItems.find((n) => n.id === activeTab)?.label}
            </strong>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--brand-500)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                AD
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: "var(--ink-900)" }}>{user?.fullName || "Quản trị viên"}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }}>Toàn quyền hệ thống</div>
              </div>
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={handleExit}
              style={{ padding: "6px 12px", fontSize: 12.5 }}
            >
              👁️ Xem giao diện khách hàng
            </button>
          </div>
        </header>

        {/* Dynamic content */}
        <main className="admin-content-area">{renderContent()}</main>
      </div>
    </div>
  );
}
