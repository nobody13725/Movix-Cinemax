import React from "react";
import { movies } from "../data/mockData.js";

function formatVnd(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function BookingSuccess({ go, params }) {
  const movie = movies.find((m) => m.id === params?.movieId) || movies[0];
  const code = "MVX" + Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <section className="section container" style={{ display: "flex", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: 460, width: "100%", textAlign: "center", padding: "40px 32px" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>
        <h2 style={{ marginBottom: 6 }}>Đặt vé thành công!</h2>
        <p style={{ color: "var(--ink-500)", fontSize: 14, marginBottom: 24 }}>
          Vé điện tử đã được gửi tới email của bạn. Vui lòng đến rạp trước giờ chiếu 15 phút.
        </p>

        <div className="card" style={{ background: "var(--ink-50)", textAlign: "left", boxShadow: "none" }}>
          <div className="summary-row"><span>Mã vé</span><span style={{ fontWeight: 700, color: "var(--ink-900)" }}>{code}</span></div>
          <div className="summary-row"><span>Phim</span><span style={{ fontWeight: 700, color: "var(--ink-900)" }}>{movie.title}</span></div>
          <div className="summary-row"><span>Rạp</span><span style={{ fontWeight: 600, color: "var(--ink-900)" }}>{params?.cinema}</span></div>
          <div className="summary-row"><span>Suất chiếu</span><span style={{ fontWeight: 600, color: "var(--ink-900)" }}>{params?.time}</span></div>
          <div className="summary-row"><span>Ghế</span><span style={{ fontWeight: 600, color: "var(--ink-900)" }}>{params?.seats?.join(", ")}</span></div>
          <div className="summary-row total"><span>Tổng thanh toán</span><span>{formatVnd(params?.total || 0)}</span></div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-secondary btn-block" onClick={() => go("profile")}>Xem vé của tôi</button>
          <button className="btn btn-primary btn-block" onClick={() => go("home")}>Về trang chủ</button>
        </div>
      </div>
    </section>
  );
}
