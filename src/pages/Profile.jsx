import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";

function formatVnd(n) {
  return (n || 0).toLocaleString("vi-VN") + "đ";
}

const STATUS_LABEL = {
  Paid: "Đã thanh toán",
  Completed: "Đã xem",
  Cancelled: "Đã huỷ",
  upcoming: "Sắp chiếu",
  done: "Đã xem",
};

export default function Profile({ go, user }) {
  const [tab, setTab] = useState("history"); // history | info | reviews
  const [orders, setOrders] = useState([]);
  const [comments, setComments] = useState([]);
  const [info, setInfo] = useState({
    name: user?.fullName || user?.name || "",
    email: user?.email || user?.identity || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);

  const loadData = () => {
    setOrders(dbService.getOrders());
    setComments(dbService.getComments());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  if (!user) {
    return (
      <section className="section container">
        <div className="empty-state">
          <h3>Bạn chưa đăng nhập</h3>
          <p>Đăng nhập để xem thông tin cá nhân và lịch sử vé đã đặt trên Movix.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            onClick={() => go("login", { redirect: "profile" })}
          >
            Đăng nhập ngay
          </button>
        </div>
      </section>
    );
  }

  function saveInfo(e) {
    e.preventDefault();
    if (user.id) {
      dbService.updateUser(user.id, {
        fullName: info.name,
        phone: info.phone,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="section container">
      <div className="section-head">
        <h2>Tài khoản thành viên</h2>
      </div>

      <div className="profile-grid">
        <div className="card" style={{ textAlign: "center" }}>
          <div className="avatar-circle" style={{ margin: "0 auto 12px" }}>
            {(user.fullName || user.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <h3 style={{ fontSize: 16 }}>{user.fullName || user.name}</h3>
          <p className="movie-meta" style={{ marginBottom: 8 }}>
            {user.email || user.identity}
          </p>
          <span
            className="badge badge-purple"
            style={{ marginBottom: 18 }}
          >
            {user.role === "admin" ? "Quản trị viên (Admin)" : "Thành viên Standard"}
          </span>

          <div className="side-menu">
            <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
              🎟️ Lịch sử vé đã đặt ({orders.length})
            </button>
            <button className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>
              👤 Thông tin cá nhân
            </button>
            <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>
              ⭐ Đánh giá phim ({comments.length})
            </button>
          </div>
        </div>

        <div>
          {/* Lịch sử đặt vé (UC10, Hình 16) */}
          {tab === "history" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: 16 }}>Vé xem phim đã đặt ({orders.length})</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => go("showtimes")}>
                  + Đặt vé mới
                </button>
              </div>

              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, color: "var(--ink-500)" }}>
                  Bạn chưa có đơn đặt vé nào.
                </div>
              ) : (
                orders.map((b) => {
                  const seatList = Array.isArray(b.seats)
                    ? b.seats.map((s) => s.seatKey || s).join(", ")
                    : b.seats || "Ghế";

                  return (
                    <div className="ticket-card" key={b.id} style={{ marginBottom: 14 }}>
                      <div
                        className="ticket-poster"
                        style={{
                          background: "var(--brand-50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 26,
                        }}
                      >
                        🎬
                      </div>
                      <div className="ticket-info">
                        <div className="title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {b.filmTitle || "Phim"}
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-600)" }}>
                            #{b.ticketCode}
                          </span>
                        </div>
                        <div className="meta">
                          {b.cinemaName} ({b.roomName}) · {b.showtimeDate || "Hôm nay"} · {b.showtimeTime}
                          <br />
                          Ghế: <strong style={{ color: "var(--ink-900)" }}>{seatList}</strong> ·{" "}
                          <span style={{ color: "var(--green-500)", fontWeight: 700 }}>
                            {formatVnd(b.totalAmount)}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="badge badge-green" style={{ marginBottom: 8, display: "block" }}>
                          {STATUS_LABEL[b.status] || "Đã thanh toán"}
                        </span>
                        {b.ticketQrUrl && (
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12 }}
                            onClick={() =>
                              go("bookingSuccess", {
                                ticketCode: b.ticketCode,
                                ticketQrUrl: b.ticketQrUrl,
                                movieTitle: b.filmTitle,
                                cinema: b.cinemaName,
                                room: b.roomName,
                                time: b.showtimeTime,
                                seats: seatList,
                                total: b.totalAmount,
                              })
                            }
                          >
                            Xem mã vé QR
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Cập nhật thông tin cá nhân (UC11, Hình 18) */}
          {tab === "info" && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 18 }}>Cập nhật thông tin tài khoản</h3>
              <form onSubmit={saveInfo}>
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email đăng ký (Tài khoản)</label>
                  <input value={info.email} disabled style={{ opacity: 0.7 }} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại liên hệ</label>
                  <input
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="Nhập số điện thoại (vd: 0988...)"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button className="btn btn-primary" type="submit">
                    Lưu thông tin
                  </button>
                  {saved && (
                    <span style={{ color: "var(--green-500)", fontSize: 13.5, fontWeight: 600 }}>
                      ✓ Đã lưu thay đổi vào cơ sở dữ liệu!
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Đánh giá của tôi */}
          {tab === "reviews" && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 18 }}>Đánh giá phim bạn đã đóng góp</h3>
              {comments.map((c) => (
                <div className="review-row" key={c.id}>
                  <div className="review-head">
                    <span style={{ fontWeight: 700, color: "var(--brand-700)" }}>{c.filmTitle}</span>
                    <span className="review-stars">{"★".repeat(c.rate)}</span>
                  </div>
                  <p className="review-text">{c.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
