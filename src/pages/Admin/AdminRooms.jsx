import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    cinemaId: "",
    rowCount: 8,
    colCount: 12,
  });

  const loadData = () => {
    setRooms(dbService.getRooms());
    const cinList = dbService.getCinemas();
    setCinemas(cinList);
    if (!formData.cinemaId && cinList.length > 0) {
      setFormData((prev) => ({ ...prev, cinemaId: cinList[0].id }));
    }
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: "",
      cinemaId: cinemas[0]?.id || "",
      rowCount: 8,
      colCount: 12,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (r) => {
    setEditingRoom(r);
    setFormData({
      name: r.name || "",
      cinemaId: r.cinemaId || "",
      rowCount: r.seatLayout?.length || 8,
      colCount: r.seatLayout?.[0]?.count || 12,
    });
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa phòng chiếu "${name}"?`)) {
      dbService.deleteRoom(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Sinh seat layout
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].slice(0, Number(formData.rowCount));
    const layout = rows.map((r, idx) => ({
      row: r,
      count: Number(formData.colCount),
      vip: idx >= rows.length - 2, // 2 hàng cuối là VIP
    }));

    const payload = {
      name: formData.name,
      cinemaId: formData.cinemaId,
      seatLayout: layout,
    };

    if (editingRoom) {
      dbService.updateRoom(editingRoom.id, payload);
    } else {
      dbService.addRoom(payload);
    }
    setShowModal(false);
  };

  const getCinemaName = (cId) => {
    const c = cinemas.find((item) => item.id === cId);
    return c ? c.name : "Chưa gắn rạp";
  };

  const calculateTotalSeats = (layout) => {
    if (!Array.isArray(layout)) return 0;
    return layout.reduce((acc, curr) => acc + (curr.count || 0), 0);
  };

  const filteredRooms = rooms.filter(
    (r) => selectedCinema === "all" || r.cinemaId === selectedCinema
  );

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý phòng chiếu</h2>
          <p className="admin-subtitle">Danh sách phòng chiếu theo từng cụm rạp (UC14, Hình 32)</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <select
            className="input-control"
            value={selectedCinema}
            onChange={(e) => setSelectedCinema(e.target.value)}
            style={{ minWidth: 200 }}
          >
            <option value="all">Tất cả rạp chiếu</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            + Thêm phòng chiếu
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên phòng chiếu</th>
              <th>Thuộc cụm rạp</th>
              <th>Số lượng ghế</th>
              <th>Loại cấu hình</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 140 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((r) => {
              const totalSeats = calculateTotalSeats(r.seatLayout);
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>
                      {r.seatLayout?.length || 8} hàng ghế
                    </div>
                  </td>
                  <td>{getCinemaName(r.cinemaId)}</td>
                  <td>
                    <strong>{totalSeats}</strong> ghế
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {r.name.includes("IMAX") ? "IMAX Laser" : r.name.includes("Gold") ? "Gold Class" : "Standard 2D"}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-green">Hoạt động</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        className="icon-action-btn edit"
                        title="Sửa phòng"
                        onClick={() => handleOpenEdit(r)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-action-btn delete"
                        title="Xóa phòng"
                        onClick={() => handleDelete(r.id, r.name)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredRooms.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không có phòng chiếu nào trong cụm rạp này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Phòng */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3>{editingRoom ? "Sửa phòng chiếu" : "Thêm phòng chiếu mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Tên phòng chiếu *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Phòng 1 (Standard 2D)"
                />
              </div>

              <div>
                <label className="form-label">Cụm rạp *</label>
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Số hàng ghế (A - J)</label>
                  <input
                    type="number"
                    min={4}
                    max={10}
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.rowCount}
                    onChange={(e) => setFormData({ ...formData, rowCount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Số ghế mỗi hàng</label>
                  <input
                    type="number"
                    min={6}
                    max={16}
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.colCount}
                    onChange={(e) => setFormData({ ...formData, colCount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ fontSize: 12.5, color: "var(--ink-500)", background: "var(--ink-50)", padding: 10, borderRadius: 6 }}>
                💡 Tổng số ghế ước tính: <strong>{Number(formData.rowCount) * Number(formData.colCount)}</strong> ghế (các hàng cuối tự động gắn nhãn VIP).
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? "Cập nhật" : "Lưu phòng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
