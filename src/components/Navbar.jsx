import React, { useState } from "react";

export default function Navbar({ route, go, user, onLogout }) {
  const [q, setQ] = useState("");

  const links = [
    { key: "home", label: "Trang chủ" },
    { key: "showtimes", label: "Lịch chiếu" },
    { key: "movies", label: "Phim" },
    { key: "cinemas", label: "Rạp" },
    { key: "promotions", label: "Khuyến mãi" },
  ];

  function submitSearch(e) {
    e.preventDefault();
    go("search", { q });
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="brand" onClick={() => go("home")} aria-label="Về trang chủ Movix">
          <span className="brand-mark">🎬</span>
          Movix
        </button>

        <nav className="nav-links">
          {links.map((l) => (
            <button
              key={l.key}
              className={route.name === l.key ? "active" : ""}
              onClick={() => go(l.key)}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <form className="nav-search" onSubmit={submitSearch}>
          <span aria-hidden="true">🔍</span>
          <input
            placeholder="Tìm phim, rạp..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>

        <div className="nav-right">
          {/* Quick Admin Access Button - ONLY VISIBLE TO LOGGED IN ADMIN */}
          {user && (user.role === "admin" || user.role === "administrator") && (
            <button
              className="btn btn-sm"
              style={{
                background: "var(--brand-50)",
                color: "var(--brand-700)",
                border: "1px solid var(--brand-300)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onClick={() => go("admin")}
              title="Bảng điều khiển Quản trị hệ thống (Chỉ dành cho Admin)"
            >
              🛡️ Quản trị Admin
            </button>
          )}

          {user ? (
            <>
              <button
                className="btn btn-ghost"
                onClick={() => go("profile")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                title="Hồ sơ tài khoản & Vé của bạn"
              >
                <span>👤 {user.name || user.fullName}</span>
                {user.role === "admin" ? (
                  <span
                    style={{
                      fontSize: 10.5,
                      background: "var(--brand-700)",
                      color: "#fff",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    ADMIN
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      background: "var(--brand-50)",
                      color: "var(--brand-700)",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontWeight: 600,
                    }}
                  >
                    Thành viên
                  </span>
                )}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => go("login")}>
                Đăng nhập
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => go("register")}>
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
