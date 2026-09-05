import React, { useMemo, useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Movies({ go, params }) {
  const [films, setFilms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCat, setSelectedCat] = useState(params?.category || "");
  const [q, setQ] = useState(params?.q || "");

  const loadData = () => {
    setFilms(dbService.getFilms());
    setCategories(dbService.getCategories());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const filtered = useMemo(() => {
    return films.filter((f) => {
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      const matchQ =
        !q ||
        f.title?.toLowerCase().includes(q.toLowerCase()) ||
        f.description?.toLowerCase().includes(q.toLowerCase());
      return matchStatus && matchQ;
    });
  }, [films, statusFilter, q]);

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <h2>{q ? `Kết quả tìm kiếm cho "${q}"` : "Danh sách phim chiếu rạp"}</h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 2 }}>
            Khám phá các bộ phim hot nhất đang và sắp công chiếu tại Movix
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="chip"
          style={{
            background: "white",
            border: "1px solid var(--ink-100)",
            padding: "10px 16px",
            fontWeight: 500,
            minWidth: 240,
            borderRadius: 8,
          }}
          placeholder="🔍 Tìm theo tên phim, nội dung..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            className="chip"
            style={{
              background: statusFilter === "all" ? "var(--brand-500)" : "var(--ink-50)",
              color: statusFilter === "all" ? "white" : "var(--ink-700)",
              padding: "10px 16px",
              fontWeight: 600,
            }}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả ({films.length})
          </button>
          <button
            className="chip"
            style={{
              background: statusFilter === "Đang chiếu" ? "var(--brand-500)" : "var(--ink-50)",
              color: statusFilter === "Đang chiếu" ? "white" : "var(--ink-700)",
              padding: "10px 16px",
              fontWeight: 600,
            }}
            onClick={() => setStatusFilter("Đang chiếu")}
          >
            Đang chiếu ({films.filter((f) => f.status === "Đang chiếu").length})
          </button>
          <button
            className="chip"
            style={{
              background: statusFilter === "Sắp chiếu" ? "var(--brand-500)" : "var(--ink-50)",
              color: statusFilter === "Sắp chiếu" ? "white" : "var(--ink-700)",
              padding: "10px 16px",
              fontWeight: 600,
            }}
            onClick={() => setStatusFilter("Sắp chiếu")}
          >
            Sắp chiếu ({films.filter((f) => f.status === "Sắp chiếu").length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Không tìm thấy phim phù hợp</h3>
          <p>Thử tìm với từ khoá khác hoặc chọn lại bộ lọc trạng thái.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {filtered.map((m) => (
            <MovieCard key={m.id} movie={m} go={go} />
          ))}
        </div>
      )}
    </section>
  );
}
