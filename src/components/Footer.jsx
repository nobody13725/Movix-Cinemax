import React from "react";

export default function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand" style={{ color: "white" }}>
            <span className="brand-mark">🎬</span>
            Movix
          </div>
          <p>Nền tảng đặt vé xem phim trực tuyến hàng đầu Việt Nam. Nhanh chóng, tiện lợi, an toàn.</p>
        </div>
        <div>
          <h4>Dịch vụ</h4>
          <div className="footer-links">
            <a onClick={() => go("showtimes")}>Đặt vé online</a>
            <a onClick={() => go("showtimes")}>Lịch chiếu phim</a>
            <a onClick={() => go("cinemas")}>Thông tin rạp</a>
            <a onClick={() => go("home")}>Khuyến mãi</a>
          </div>
        </div>
        <div>
          <h4>Hỗ trợ</h4>
          <div className="footer-links">
            <a onClick={() => go("home")}>Liên hệ</a>
            <a onClick={() => go("home")}>Câu hỏi thường gặp</a>
            <a onClick={() => go("home")}>Chính sách bảo mật</a>
            <a onClick={() => go("home")}>Điều khoản sử dụng</a>
          </div>
        </div>
        <div>
          <h4>Kết nối</h4>
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Facebook</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>TikTok</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Movix. Tất cả quyền được bảo lưu.</div>
    </footer>
  );
}
