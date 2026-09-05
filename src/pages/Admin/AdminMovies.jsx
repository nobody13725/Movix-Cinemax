import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";
import { FALLBACK_POSTER, FALLBACK_BACKDROP, handleImageError } from "../../utils/imageFallback.js";

export default function AdminMovies() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);
  const [viewFilm, setViewFilm] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    duration: 120,
    rating: 8.5,
    ageRating: "T13",
    format: "2D, 3D",
    status: "Đang chiếu",
    description: "",
    trailer: "",
    thumbnail: "🎬",
    actors: "",
    directors: "",
  });

  const loadData = () => {
    setFilms(dbService.getFilms());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingFilm(null);
    setFormData({
      title: "",
      duration: 120,
      rating: 8.5,
      ageRating: "T13",
      format: "2D, 3D",
      status: "Đang chiếu",
      description: "",
      trailer: "",
      thumbnail: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/w1280/t5zCBSNVWXMLWRAsRFCqnl9LR6t.jpg",
      actors: "Tom Cruise, Zendaya",
      directors: "Christopher Nolan",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (film) => {
    setEditingFilm(film);
    setFormData({
      title: film.title || "",
      duration: film.duration || 120,
      rating: film.rating || 8.0,
      ageRating: film.ageRating || "T13",
      format: film.format || "2D",
      status: film.status || "Đang chiếu",
      description: film.description || "",
      trailer: film.trailer || "",
      thumbnail: film.thumbnail || "",
      posterUrl: film.posterUrl || film.thumbnail || "",
      backdropUrl: film.backdropUrl || "",
      actors: Array.isArray(film.actors) ? film.actors.join(", ") : film.actors || "",
      directors: Array.isArray(film.directors) ? film.directors.join(", ") : film.directors || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa phim "${title}"?`)) {
      dbService.deleteFilm(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const poster = formData.posterUrl?.trim() || formData.thumbnail?.trim() || "";
    const payload = {
      ...formData,
      posterUrl: poster,
      thumbnail: poster || "🎬",
      backdropUrl: formData.backdropUrl?.trim() || "",
      trailer: formData.trailer?.trim() || "",
      duration: Number(formData.duration) || 120,
      rating: Number(formData.rating) || 8.0,
      actors: typeof formData.actors === "string" ? formData.actors.split(",").map((s) => s.trim()).filter(Boolean) : formData.actors,
      directors: typeof formData.directors === "string" ? formData.directors.split(",").map((s) => s.trim()).filter(Boolean) : formData.directors,
    };

    if (editingFilm) {
      dbService.updateFilm(editingFilm.id, payload);
    } else {
      dbService.addFilm(payload);
    }
    setShowModal(false);
  };

  const filteredFilms = films.filter(
    (f) =>
      f.title?.toLowerCase().includes(search.toLowerCase()) ||
      f.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* Header UC12 */}
      <div className="admin-header-row">
        <div>
          <h2>Quản lý phim</h2>
          <p className="admin-subtitle">Danh sách phim hiện tại trong hệ thống (UC12)</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm("Bạn có chắc muốn khôi phục lại toàn bộ cơ sở dữ liệu mẫu với 12 phim và ảnh thật chất lượng cao?")) {
                dbService.resetToInitialData();
              }
            }}
            title="Khôi phục toàn bộ CSDL mẫu"
          >
            🔄 Khôi phục CSDL mẫu
          </button>
          <input
            type="text"
            className="input-control"
            placeholder="🔍 Tìm tên phim..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 200, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--ink-100)" }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            + Thêm phim mới
          </button>
        </div>
      </div>

      {/* Table matching Section 3.2.12 */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Poster</th>
              <th>Tên phim</th>
              <th>Thời lượng</th>
              <th>Hình thức chiếu</th>
              <th>Độ tuổi</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 140 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredFilms.map((film) => (
              <tr key={film.id}>
                <td>
                  <div
                    style={{
                      width: 44,
                      height: 60,
                      background: "var(--brand-50)",
                      borderRadius: 6,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {(film.posterUrl || film.thumbnail) && ((film.posterUrl || film.thumbnail).startsWith("http") || (film.posterUrl || film.thumbnail).startsWith("data:image")) ? (
                      <img
                        src={film.posterUrl || film.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      film.thumbnail || "🎬"
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>{film.title}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>
                    Khởi chiếu: {film.releaseDate || "Đang chiếu"}
                  </div>
                </td>
                <td>{film.duration} phút</td>
                <td>
                  <span className="badge badge-purple">{film.format || "2D, 3D"}</span>
                </td>
                <td>
                  <span className="badge badge-amber">{film.ageRating || "P"}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: "var(--amber-500)" }}>★ {film.rating}</span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      film.status === "Đang chiếu" ? "badge-green" : "badge-gray"
                    }`}
                  >
                    {film.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="icon-action-btn view"
                      title="Xem chi tiết"
                      onClick={() => setViewFilm(film)}
                    >
                      👁️
                    </button>
                    <button
                      className="icon-action-btn edit"
                      title="Sửa phim"
                      onClick={() => handleOpenEdit(film)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-action-btn delete"
                      title="Xóa phim"
                      onClick={() => handleDelete(film.id, film.title)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredFilms.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không tìm thấy phim nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa phim */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3>{editingFilm ? "Chỉnh sửa phim" : "Thêm phim mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Tên phim *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Avatar: Dòng Chảy Của Nước"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Thời lượng (phút)</label>
                  <input
                    type="number"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Điểm đánh giá</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Độ tuổi</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.ageRating}
                    onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                  >
                    <option value="P">P - Phổ biến</option>
                    <option value="T13">T13 - Trên 13 tuổi</option>
                    <option value="T16">T16 - Trên 16 tuổi</option>
                    <option value="T18">T18 - Trên 18 tuổi</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Đang chiếu">Đang chiếu</option>
                    <option value="Sắp chiếu">Sắp chiếu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Hình thức chiếu</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  placeholder="2D, 3D, IMAX..."
                />
              </div>

              {/* URL Poster & Backdrop ảnh thật */}
              <div>
                <label className="form-label">Link ảnh Poster (ảnh dọc TMDB/Unsplash/URL)</label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    className="input-control"
                    style={{ flex: 1 }}
                    value={formData.posterUrl || formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value, thumbnail: e.target.value })}
                    placeholder="https://... ảnh poster dọc"
                  />
                  {(formData.posterUrl || formData.thumbnail) && ((formData.posterUrl || formData.thumbnail).startsWith("http") || (formData.posterUrl || formData.thumbnail).startsWith("data:image")) && (
                    <img
                      src={formData.posterUrl || formData.thumbnail}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      style={{ width: 36, height: 48, objectFit: "cover", borderRadius: 4, border: "1px solid var(--ink-200)" }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Link ảnh Backdrop (ảnh banner ngang)</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.backdropUrl}
                  onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                  placeholder="https://... ảnh nền ngang (tùy chọn)"
                />
              </div>

              <div>
                <label className="form-label">Link Trailer YouTube</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.trailer}
                  onChange={(e) => setFormData({ ...formData, trailer: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="form-label">Diễn viên (cách nhau dấu phẩy)</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.actors}
                  onChange={(e) => setFormData({ ...formData, actors: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Mô tả phim</label>
                <textarea
                  rows={3}
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFilm ? "Cập nhật" : "Lưu phim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết */}
      {viewFilm && (
        <div className="modal-overlay" onClick={() => setViewFilm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 100,
                  background: "var(--brand-50)",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  flexShrink: 0,
                }}
              >
                {(viewFilm.posterUrl || viewFilm.thumbnail) && ((viewFilm.posterUrl || viewFilm.thumbnail).startsWith("http") || (viewFilm.posterUrl || viewFilm.thumbnail).startsWith("data:image")) ? (
                  <img
                    src={viewFilm.posterUrl || viewFilm.thumbnail}
                    alt={viewFilm.title}
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  viewFilm.thumbnail || "🎬"
                )}
              </div>
              <div>
                <h3 style={{ fontSize: 18 }}>{viewFilm.title}</h3>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  <span className="badge badge-purple">{viewFilm.format}</span>
                  <span className="badge badge-amber">{viewFilm.ageRating}</span>
                  <span className="badge badge-green">{viewFilm.status}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.6 }}>
              <p><strong>Thời lượng:</strong> {viewFilm.duration} phút</p>
              <p><strong>Điểm số:</strong> ★ {viewFilm.rating}/10</p>
              <p><strong>Diễn viên:</strong> {Array.isArray(viewFilm.actors) ? viewFilm.actors.join(", ") : viewFilm.actors}</p>
              <p style={{ marginTop: 8 }}><strong>Tóm tắt:</strong> {viewFilm.description}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setViewFilm(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
