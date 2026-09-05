import React from "react";

function formatVnd(n) {
  return (n || 0).toLocaleString("vi-VN") + "đ";
}

export default function BookingSuccess({ go, params }) {
  const code = params?.ticketCode || "MVX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const qrUrl =
    params?.ticketQrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(code)}`;

  return (
    <section className="section container" style={{ display: "flex", justifyContent: "center" }}>
      <div
        className="card"
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          padding: "36px 30px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎉</div>
        <h2 style={{ marginBottom: 6 }}>Đặt vé xem phim thành công!</h2>
        <p style={{ color: "var(--ink-500)", fontSize: 13.5, marginBottom: 20 }}>
          Giao dịch đã được ghi nhận trên hệ thống cơ sở dữ liệu. Vui lòng xuất trình mã vé hoặc QR tại quầy soát vé.
        </p>

        {/* QR Code container */}
        <div
          style={{
            background: "white",
            padding: 14,
            display: "inline-block",
            borderRadius: 12,
            border: "2px dashed var(--brand-300)",
            marginBottom: 20,
          }}
        >
          <img
            src={qrUrl}
            alt={`Mã QR ${code}`}
            style={{ width: 140, height: 140, display: "block" }}
          />
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "var(--brand-600)" }}>
            QUÉT TẠI CỬA SOÁT VÉ
          </div>
        </div>

        {/* Chi tiết vé điện tử */}
        <div className="card" style={{ background: "var(--ink-50)", textAlign: "left", boxShadow: "none" }}>
          <div className="summary-row">
            <span>Mã đặt chỗ (Code)</span>
            <span style={{ fontWeight: 800, color: "var(--brand-600)", letterSpacing: "0.04em" }}>
              {code}
            </span>
          </div>
          <div className="summary-row">
            <span>Bộ phim</span>
            <span style={{ fontWeight: 700, color: "var(--ink-900)" }}>{params?.movieTitle || "Phim"}</span>
          </div>
          <div className="summary-row">
            <span>Rạp & Phòng chiếu</span>
            <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>
              {params?.cinema} ({params?.room || "Phòng 1"})
            </span>
          </div>
          <div className="summary-row">
            <span>Suất chiếu</span>
            <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>
              {params?.time} · {params?.date || "Hôm nay"}
            </span>
          </div>
          <div className="summary-row">
            <span>Vị trí ghế ngồi</span>
            <span style={{ fontWeight: 700, color: "var(--brand-600)" }}>
              {Array.isArray(params?.seats) ? params.seats.join(", ") : params?.seats}
            </span>
          </div>
          <div className="summary-row total">
            <span>Tổng số tiền đã thanh toán</span>
            <span style={{ color: "var(--green-500)", fontWeight: 800 }}>
              {formatVnd(params?.total || 0)}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button className="btn btn-secondary btn-block" onClick={() => go("profile")}>
            Xem trong Tài khoản
          </button>
          <button className="btn btn-primary btn-block" onClick={() => go("home")}>
            Về trang chủ
          </button>
        </div>
      </div>
    </section>
  );
}
