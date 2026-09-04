import React, { useState } from "react";
import { movies, seedBookingHistory } from "../data/mockData.js";

function formatVnd(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

const STATUS_LABEL = { upcoming: "Sắp chiếu", done: "Đã xem", cancelled: "Đã huỷ" };

export default function Profile({ go, user }) {
  const [tab, setTab] = useState("info");
  const [history] = useState(seedBookingHistory);
  const [info, setInfo] = useState({ name: user?.name || "", email: user?.identity || "", phone: "" });
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <section className="section container">
        <div className="empty-state">
          <h3>Bạn chưa đăng nhập</h3>
          <p>Đăng nhập để xem thông tin cá nhân và lịch sử đặt vé.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => go("login", { redirect: "profile" })}>
            Đăng nhập
          </button>
        </div>
      </section>
    );
  }

  function saveInfo(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <section className="section container">
      <div className="section-head"><h2>Tài khoản của tôi</h2></div>

      <div className="profile-grid">
        <div className="card" style={{ textAlign: "center" }}>
          <div className="avatar-circle" style={{ margin: "0 auto 12px" }}>
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h3 style={{ fontSize: 16 }}>{user.name}</h3>
          <p className="movie-meta" style={{ marginBottom: 18 }}>{user.identity}</p>
          <div className="side-menu">
            <button className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>👤 Thông tin cá nhân</button>
            <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>🎟️ Lịch sử đặt vé</button>
            <button className={tab === "reviews" ? "active" : ""} onClick={() => setTab("reviews")}>⭐ Đánh giá của tôi</button>
          </div>
        </div>

        <div>
          {tab === "info" && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 18 }}>Thông tin cá nhân</h3>
              <form onSubmit={saveInfo}>
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} placeholder="Chưa cập nhật" />
                </div>
                <button className="btn btn-primary" type="submit">Lưu thay đổi</button>
                {saved && <span style={{ marginLeft: 12, color: "var(--green-500)", fontSize: 13.5, fontWeight: 600 }}>Đã lưu thông tin</span>}
              </form>
            </div>
          )}

          {tab === "history" && (
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 18 }}>Lịch sử đặt vé</h3>
              {history.map((b) => {
                const movie = movies.find((m) => m.id === b.movieId);
                return (
                  <div className="ticket-card" key={b.id}>
                    <div className="ticket-poster" style={{ background: movie.color }}>{movie.emoji}</div>
                    <div className="ticket-info">
                      <div className="title">{movie.title}</div>
                      <div className="meta">
                        {b.cinema} · {b.date} · {b.time}<br />
                        Ghế {b.seats.join(", ")} · {formatVnd(b.total)}
                      </div>
                    </div>
                    <span className={`status-pill ${b.status}`}>{STATUS_LABEL[b.status]}</span>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "reviews" && (
            <div className="card">
              <div className="empty-state">
                <h3>Chưa có đánh giá nào</h3>
                <p>Đánh giá phim sau khi xem để chia sẻ trải nghiệm với cộng đồng Movix.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
