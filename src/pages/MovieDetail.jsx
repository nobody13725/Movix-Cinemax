import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import { FALLBACK_POSTER, FALLBACK_BACKDROP, handleImageError } from "../utils/imageFallback";

export default function MovieDetail({ go, goBack, params, user }) {
  const [film, setFilm] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [commentContent, setCommentContent] = useState("");
  const [reportModal, setReportModal] = useState(null);
  const [reportReason, setReportReason] = useState("Ngôn từ xúc phạm, thiếu văn hóa");

  const loadData = () => {
    const films = dbService.getFilms();
    const found = films.find((f) => f.id === params?.id) || films[0];
    setFilm(found);
    if (found) {
      const allComments = dbService.getComments();
      setComments(allComments.filter((c) => c.filmId === found.id));
    }
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, [params?.id]);

  if (!film) return null;

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    dbService.addComment({
      userId: user?.id || `usr-${Date.now()}`,
      userName: user?.fullName || user?.name || "Khán giả Movix",
      filmId: film.id,
      filmTitle: film.title,
      rate: Number(userRating),
      content: commentContent.trim(),
    });

    setCommentContent("");
    setShowCommentForm(false);
  };

  const handleReportComment = (e) => {
    e.preventDefault();
    if (!reportModal) return;

    dbService.reportComment(
      reportModal.id,
      reportReason,
      user?.fullName || user?.name || "Người dùng ẩn danh"
    );
    alert("Đã gửi báo cáo vi phạm tới ban quản trị! Cảm ơn bạn.");
    setReportModal(null);
  };

  return (
    <section className="section container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => (typeof goBack === "function" ? goBack() : go("movies"))}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
        >
          ← Quay lại
        </button>
        <div className="breadcrumb" style={{ margin: 0 }}>
          <button onClick={() => go("home")}>Trang chủ</button>
          <span className="sep">/</span>
          <button onClick={() => go("movies")}>Phim</button>
          <span className="sep">/</span>
          <span>{film.title}</span>
        </div>
      </div>

      {/* Hero Movie Detail (UC04, Figure 8) */}
      <div
        className="detail-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          background: film.backdropUrl
            ? `linear-gradient(to right, rgba(16, 17, 34, 0.95) 25%, rgba(20, 21, 43, 0.85) 60%, rgba(20, 21, 43, 0.75) 100%), url(${film.backdropUrl}) center/cover no-repeat`
            : `linear-gradient(to right, rgba(16, 17, 34, 0.95) 25%, rgba(20, 21, 43, 0.85) 60%, rgba(20, 21, 43, 0.75) 100%), url(${FALLBACK_BACKDROP}) center/cover no-repeat`,
        }}
      >
        <div
          className="detail-poster"
          style={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(135deg, var(--brand-700), var(--purple-600))",
            boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={film.posterUrl || film.thumbnail || FALLBACK_POSTER}
            alt={film.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, FALLBACK_POSTER)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
            }}
          />
        </div>
        <div>
          <div className="rating-badge">⭐ {film.rating || 8.5} / 10</div>
          <h1>{film.title}</h1>
          <div className="detail-tags">
            <span className="tag">{film.ageRating || "T13"}</span>
            <span className="tag">{film.format || "2D, 3D"}</span>
            <span className="tag">{film.duration} phút</span>
            <span className="tag" style={{ background: "rgba(34,197,94,0.25)" }}>
              {film.status || "Đang chiếu"}
            </span>
          </div>
          <div className="detail-meta-row">
            <span>🎞️ Định dạng: {film.format || "2D, 3D, IMAX"}</span>
            <span>📅 Khởi chiếu: {film.releaseDate || "Đang chiếu"}</span>
          </div>
          <p className="detail-desc">{film.description}</p>

          {params?.promoCode && (
            <div
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px dashed rgba(255,255,255,0.5)",
                color: "#fef08a",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <span>🏷️</span> Đang kèm voucher: {params.promoCode}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() => go("showtimes", { movieId: film.id, promoCode: params?.promoCode })}
            >
              🎟️ Đặt vé ngay
            </button>
            {film.trailer && (
              <a
                href={film.trailer}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                ▶ Xem trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Thông tin chi tiết & Bình luận / Đánh giá */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
        {/* Box Thông tin */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Thông tin tác phẩm</h3>
          <div className="summary-row">
            <span>Thời lượng</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{film.duration} phút</span>
          </div>
          <div className="summary-row">
            <span>Giới hạn tuổi</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{film.ageRating || "P"}</span>
          </div>
          <div className="summary-row">
            <span>Hình thức chiếu</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{film.format || "2D, 3D"}</span>
          </div>
          <div className="summary-row">
            <span>Diễn viên</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600, textAlign: "right" }}>
              {Array.isArray(film.actors) ? film.actors.join(", ") : film.actors || "Đang cập nhật"}
            </span>
          </div>
          <div className="summary-row">
            <span>Đạo diễn</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>
              {Array.isArray(film.directors) ? film.directors.join(", ") : film.directors || "Đang cập nhật"}
            </span>
          </div>
          <div className="summary-row">
            <span>Điểm trung bình</span>
            <span style={{ color: "var(--amber-500)", fontWeight: 700 }}>★ {film.rating}/10</span>
          </div>
        </div>

        {/* Box Đánh giá từ khán giả (UC04, Figure 9, UC17) */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 16 }}>Đánh giá từ khán giả ({comments.length})</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowCommentForm(!showCommentForm)}
            >
              {showCommentForm ? "Hủy" : "✍️ Viết đánh giá"}
            </button>
          </div>

          {/* Form thêm bình luận */}
          {showCommentForm && (
            <form
              onSubmit={handlePostComment}
              style={{
                background: "var(--ink-50)",
                padding: 14,
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid var(--ink-100)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Đánh giá số sao:</span>
                <select
                  value={userRating}
                  onChange={(e) => setUserRating(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid var(--ink-100)",
                    fontWeight: 700,
                    color: "var(--amber-500)",
                  }}
                >
                  <option value={5}>★★★★★ 5 sao</option>
                  <option value={4}>★★★★☆ 4 sao</option>
                  <option value={3}>★★★☆☆ 3 sao</option>
                  <option value={2}>★★☆☆☆ 2 sao</option>
                  <option value={1}>★☆☆☆☆ 1 sao</option>
                </select>
              </div>

              <textarea
                required
                rows={3}
                placeholder="Chia sẻ cảm nhận của bạn về bộ phim này..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--ink-100)",
                  fontSize: 13.5,
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Gửi bình luận
                </button>
              </div>
            </form>
          )}

          {/* Danh sách bình luận */}
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {comments.map((c) => (
              <div className="review-row" key={c.id}>
                <div className="review-head" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="small-avatar" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {c.avatar ? (
                        <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        (c.userName || "U").slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="review-name">{c.userName || "Khán giả"}</div>
                      <div className="review-stars">
                        {"★".repeat(c.rate || 5)}
                        {"☆".repeat(Math.max(0, 5 - (c.rate || 5)))}
                      </div>
                    </div>
                  </div>

                  {/* Nút báo cáo bình luận xấu UC17 */}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11.5, color: "var(--ink-500)", padding: "2px 8px" }}
                    onClick={() => setReportModal(c)}
                    title="Báo cáo bình luận này"
                  >
                    🚩 Báo cáo
                  </button>
                </div>
                <p className="review-text">{c.content}</p>
                {c.report && (
                  <div style={{ fontSize: 11, color: "var(--red-500)", fontStyle: "italic", marginTop: 4 }}>
                    ⚠️ Bình luận này đang được ban quản trị xem xét báo cáo.
                  </div>
                )}
              </div>
            ))}
            {comments.length === 0 && (
              <div style={{ color: "var(--ink-500)", textAlign: "center", padding: 20, fontSize: 13.5 }}>
                Chưa có đánh giá nào cho phim này. Hãy là người đầu tiên để lại cảm nhận!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Báo cáo bình luận vi phạm UC17 */}
      {reportModal && (
        <div className="modal-overlay" onClick={() => setReportModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3>🚩 Báo cáo bình luận vi phạm</h3>
            <p style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>
              Nội dung vi phạm sẽ được gửi tới Ban quản trị kiểm duyệt và xử lý theo quy định Movix.
            </p>

            <form onSubmit={handleReportComment} style={{ marginTop: 16 }}>
              <label className="form-label">Lý do báo cáo *</label>
              <select
                className="input-control"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="Ngôn từ xúc phạm, thiếu văn hóa">Ngôn từ xúc phạm, thiếu văn hóa</option>
                <option value="Tiết lộ nội dung phim (Spoiler)">Tiết lộ nội dung phim (Spoiler)</option>
                <option value="Spam quảng cáo hoặc link độc hại">Spam quảng cáo hoặc link độc hại</option>
                <option value="Nội dung quấy rối hoặc sai sự thật">Nội dung quấy rối hoặc sai sự thật</option>
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReportModal(null)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ background: "var(--red-500)" }}>
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
