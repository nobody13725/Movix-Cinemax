import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [filterFilm, setFilterFilm] = useState("all");
  const [filterCinema, setFilterCinema] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState(null);

  const [formData, setFormData] = useState({
    filmId: "",
    cinemaId: "",
    roomId: "",
    startTime: "18:00",
    date: new Date().toISOString().slice(0, 10),
    basePrice: 85000,
  });

  const loadData = () => {
    setShowtimes(dbService.getShowtimes());
    const fList = dbService.getFilms();
    const cList = dbService.getCinemas();
    const rList = dbService.getRooms();
    setFilms(fList);
    setCinemas(cList);
    setRooms(rList);

    if (!formData.filmId && fList.length > 0) {
      setFormData((prev) => ({
        ...prev,
        filmId: fList[0].id,
        cinemaId: cList[0]?.id || "",
        roomId: rList[0]?.id || "",
      }));
    }
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingShowtime(null);
    setFormData({
      filmId: films[0]?.id || "",
      cinemaId: cinemas[0]?.id || "",
      roomId: rooms[0]?.id || "",
      startTime: "18:30",
      date: new Date().toISOString().slice(0, 10),
      basePrice: 85000,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (st) => {
    setEditingShowtime(st);
    setFormData({
      filmId: st.filmId || films[0]?.id,
      cinemaId: st.cinemaId || cinemas[0]?.id,
      roomId: st.roomId || rooms[0]?.id,
      startTime: st.startTime || "18:00",
      date: st.date || new Date().toISOString().slice(0, 10),
      basePrice: st.basePrice || 85000,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa suất chiếu này?")) {
      dbService.deleteShowtime(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      basePrice: Number(formData.basePrice) || 85000,
    };

    if (editingShowtime) {
      dbService.updateShowtime(editingShowtime.id, payload);
    } else {
      dbService.addShowtime(payload);
    }
    setShowModal(false);
  };

  const getFilm = (id) => films.find((f) => f.id === id);
  const getCinema = (id) => cinemas.find((c) => c.id === id);
  const getRoom = (id) => rooms.find((r) => r.id === id);

  const filteredShowtimes = showtimes.filter((st) => {
    if (filterFilm !== "all" && st.filmId !== filterFilm) return false;
    if (filterCinema !== "all" && st.cinemaId !== filterCinema) return false;
    return true;
  });

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý suất chiếu</h2>
          <p className="admin-subtitle">Lịch phát sóng theo phim, rạp và khung giờ (UC15, Hình 34, 35)</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Thêm suất chiếu mới
        </button>
      </div>

      {/* Stats Cards matching Fig 35 */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Tổng suất chiếu</div>
          <div className="stat-number">{showtimes.length}</div>
          <div className="stat-trend positive">Hôm nay</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đang hoạt động</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>{showtimes.length}</div>
          <div className="stat-sub">Sẵn sàng đặt vé</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Phim có suất chiếu</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>
            {new Set(showtimes.map((s) => s.filmId)).size}
          </div>
          <div className="stat-sub">Đang khai thác</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Rạp phục vụ</div>
          <div className="stat-number" style={{ color: "var(--amber-500)" }}>
            {new Set(showtimes.map((s) => s.cinemaId)).size}
          </div>
          <div className="stat-sub">Điểm chiếu kết nối</div>
        </div>
      </div>

      {/* Filter bar matching Fig 35 */}
      <div className="admin-card" style={{ marginTop: 16, padding: "14px 20px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>Lọc theo Phim</label>
            <select
              className="input-control"
              value={filterFilm}
              onChange={(e) => setFilterFilm(e.target.value)}
              style={{ minWidth: 200 }}
            >
              <option value="all">Tất cả phim</option>
              {films.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>Lọc theo Cụm rạp</label>
            <select
              className="input-control"
              value={filterCinema}
              onChange={(e) => setFilterCinema(e.target.value)}
              style={{ minWidth: 200 }}
            >
              <option value="all">Tất cả rạp</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ alignSelf: "flex-end" }}
            onClick={() => {
              setFilterFilm("all");
              setFilterCinema("all");
            }}
          >
            ↺ Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Table Section 3.2.15 */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>Ảnh</th>
              <th>Tên phim</th>
              <th>Thời gian</th>
              <th>Phòng chiếu</th>
              <th>Rạp chiếu</th>
              <th>Giá vé gốc</th>
              <th>Ghế đã đặt</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 120 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredShowtimes.map((st) => {
              const f = getFilm(st.filmId);
              const c = getCinema(st.cinemaId);
              const r = getRoom(st.roomId);
              return (
                <tr key={st.id}>
                  <td>
                    <div style={{ fontSize: 24 }}>{f?.thumbnail || "🎬"}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>{f?.title || "Phim Movix"}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{f?.duration || 120} phút</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--brand-600)" }}>{st.startTime}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{st.date}</div>
                  </td>
                  <td>{r?.name || "Phòng 1"}</td>
                  <td style={{ fontSize: 13, color: "var(--ink-700)" }}>{c?.name || "CGV"}</td>
                  <td>
                    <strong>{(st.basePrice || 75000).toLocaleString("vi-VN")}đ</strong>
                  </td>
                  <td>
                    <span className="badge badge-purple">{st.seatsBooked?.length || 0} ghế</span>
                  </td>
                  <td>
                    <span className="badge badge-green">Đang hoạt động</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        className="icon-action-btn edit"
                        title="Sửa suất chiếu"
                        onClick={() => handleOpenEdit(st)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-action-btn delete"
                        title="Xóa suất chiếu"
                        onClick={() => handleDelete(st.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredShowtimes.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không có suất chiếu nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Suất chiếu */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3>{editingShowtime ? "Sửa suất chiếu" : "Thêm suất chiếu mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Chọn phim *</label>
                <select
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.filmId}
                  onChange={(e) => setFormData({ ...formData, filmId: e.target.value })}
                >
                  {films.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} ({f.duration} phút)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Chọn rạp chiếu *</label>
                <select
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.cinemaId}
                  onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
                >
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Chọn phòng chiếu *</label>
                <select
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Ngày chiếu *</label>
                  <input
                    type="date"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Giá vé cơ chuẩn (VND) *</label>
                <input
                  type="number"
                  step="5000"
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingShowtime ? "Cập nhật" : "Tạo suất chiếu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
