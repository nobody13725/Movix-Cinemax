import React from "react";
import { movies, reviews } from "../data/mockData.js";

export default function MovieDetail({ go, params }) {
  const movie = movies.find((m) => m.id === params?.id) || movies[0];

  return (
    <section className="section container">
      <div className="breadcrumb">
        <button onClick={() => go("home")}>Trang chủ</button>
        <span className="sep">/</span>
        <button onClick={() => go("movies")}>Phim</button>
        <span className="sep">/</span>
        <span>{movie.title}</span>
      </div>

      <div className="detail-hero">
        <div className="detail-poster" style={{ background: movie.color, color: "var(--ink-900)" }}>
          {movie.emoji}
        </div>
        <div>
          <div className="rating-badge">⭐ {movie.rating} / 10</div>
          <h1>{movie.title}</h1>
          <div className="detail-tags">
            <span className="tag">{movie.ageTag}</span>
            <span className="tag">{movie.genre}</span>
            <span className="tag">{movie.duration} phút</span>
          </div>
          <div className="detail-meta-row">
            <span>🎞️ Phụ đề tiếng Việt</span>
            <span>📅 Đang chiếu</span>
          </div>
          <p className="detail-desc">{movie.desc}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
            <button className="btn btn-primary" onClick={() => go("showtimes", { movieId: movie.id })}>
              Đặt vé ngay
            </button>
            <button className="btn btn-secondary" style={{ background: "rgba(255,255,255,0.14)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              ▶ Xem trailer
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Thông tin phim</h3>
          <div className="summary-row"><span>Thể loại</span><span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{movie.genre}</span></div>
          <div className="summary-row"><span>Thời lượng</span><span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{movie.duration} phút</span></div>
          <div className="summary-row"><span>Giới hạn tuổi</span><span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{movie.ageTag}</span></div>
          <div className="summary-row"><span>Đánh giá</span><span style={{ color: "var(--ink-900)", fontWeight: 600 }}>⭐ {movie.rating}/10</span></div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 6 }}>Đánh giá từ khán giả</h3>
          {reviews.map((r, i) => (
            <div className="review-row" key={i}>
              <div className="review-head">
                <div className="small-avatar">{r.initials}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                </div>
              </div>
              <p className="review-text">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
