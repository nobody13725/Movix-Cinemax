import React, { useMemo, useState } from "react";
import { movies, genres } from "../data/mockData.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Movies({ go, params }) {
  const [genre, setGenre] = useState(params?.genre || "");
  const [q, setQ] = useState(params?.q || "");

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchGenre = !genre || m.genre === genre;
      const matchQ = !q || m.title.toLowerCase().includes(q.toLowerCase());
      return matchGenre && matchQ;
    });
  }, [genre, q]);

  return (
    <section className="section container">
      <div className="section-head">
        <h2>{q ? `Kết quả tìm kiếm cho "${q}"` : "Danh sách phim"}</h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="chip"
          style={{ background: "white", border: "1px solid var(--ink-100)", padding: "10px 16px", fontWeight: 500, minWidth: 220 }}
          placeholder="Tìm theo tên phim..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={`chip ${!genre ? "" : ""}`} style={{ background: !genre ? "var(--brand-500)" : "var(--ink-50)", color: !genre ? "white" : "var(--ink-700)", padding: "10px 16px" }} onClick={() => setGenre("")}>
          Tất cả
        </button>
        {genres.map((g) => (
          <button
            key={g}
            className="chip"
            style={{ background: genre === g ? "var(--brand-500)" : "var(--ink-50)", color: genre === g ? "white" : "var(--ink-700)", padding: "10px 16px" }}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Không tìm thấy phim phù hợp</h3>
          <p>Thử một từ khoá khác hoặc bỏ bớt bộ lọc thể loại.</p>
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
