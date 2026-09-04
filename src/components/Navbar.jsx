import React, { useState } from "react";

export default function Navbar({ route, go, user, onLogout }) {
  const [q, setQ] = useState("");

  const links = [
    { key: "home", label: "Trang chủ" },
    { key: "showtimes", label: "Lịch chiếu" },
    { key: "movies", label: "Phim" },
    { key: "cinemas", label: "Rạp" },
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
          {user ? (
            <>
              <button className="btn btn-ghost" onClick={() => go("profile")}>
                Xin chào, {user.name.split(" ").slice(-1)[0]}
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
