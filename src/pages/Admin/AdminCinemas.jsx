import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminCinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [viewCinema, setViewCinema] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cityId: "city-1",
    description: "",
  });

  const loadData = () => {
    setCinemas(dbService.getCinemas());
    setCities(dbService.getCities());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingCinema(null);
    setFormData({
      name: "",
      address: "",
      cityId: cities[0]?.id || "city-1",
      description: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCinema(c);
    setFormData({
      name: c.name || "",
      address: c.address || "",
      cityId: c.cityId || "city-1",
      description: c.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa rạp chiếu "${name}"?`)) {
      dbService.deleteCinema(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCinema) {
      dbService.updateCinema(editingCinema.id, formData);
    } else {
      dbService.addCinema(formData);
    }
    setShowModal(false);
  };

  const getCityName = (cityId) => {
    const city = cities.find((ct) => ct.id === cityId);
    return city ? city.name : "Khác";
  };

  const filteredCinemas = cinemas.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý rạp chiếu</h2>
          <p className="admin-subtitle">Danh sách rạp chiếu hiện có (UC13, Hình 31)</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="text"
            className="input-control"
            placeholder="🔍 Tìm tên rạp, địa chỉ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--ink-100)" }}
          />
          <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
            + Thêm rạp mới
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Logo</th>
              <th>Tên rạp chiếu</th>
              <th>Địa chỉ</th>
              <th>Thành phố</th>
              <th style={{ textAlign: "right", width: 140 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCinemas.map((c) => (
              <tr key={c.id}>
                <td>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: "var(--brand-50)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {c.avatar || "🏢"}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: "var(--ink-900)" }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 2 }}>{c.description}</div>
                </td>
                <td style={{ fontSize: 13.5, color: "var(--ink-700)" }}>{c.address}</td>
                <td>
                  <span className="badge badge-purple">{getCityName(c.cityId)}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="icon-action-btn view"
                      title="Xem chi tiết"
                      onClick={() => setViewCinema(c)}
                    >
                      👁️
                    </button>
                    <button
                      className="icon-action-btn edit"
                      title="Sửa rạp"
                      onClick={() => handleOpenEdit(c)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-action-btn delete"
                      title="Xóa rạp"
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCinemas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không có rạp chiếu nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Rạp */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3>{editingCinema ? "Chỉnh sửa rạp chiếu" : "Thêm rạp chiếu mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Tên rạp chiếu *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: CGV Vincom Center"
                />
              </div>

              <div>
                <label className="form-label">Thành phố *</label>
                <select
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                >
                  {cities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Địa chỉ rạp *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, đường, phường, quận..."
                />
              </div>

              <div>
                <label className="form-label">Giới thiệu rạp</label>
                <textarea
                  rows={3}
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tiêu chuẩn phòng chiếu, đặc điểm nổi bật..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCinema ? "Cập nhật" : "Lưu rạp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết Rạp */}
      {viewCinema && (
        <div className="modal-overlay" onClick={() => setViewCinema(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 40, background: "var(--brand-50)", padding: 12, borderRadius: 12 }}>
                {viewCinema.avatar || "🏢"}
              </div>
              <div>
                <h3 style={{ fontSize: 18 }}>{viewCinema.name}</h3>
                <span className="badge badge-purple" style={{ marginTop: 4 }}>
                  {getCityName(viewCinema.cityId)}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 13.5, color: "var(--ink-700)", lineHeight: 1.6 }}>
              <p><strong>Địa chỉ:</strong> {viewCinema.address}</p>
              <p style={{ marginTop: 8 }}><strong>Mô tả:</strong> {viewCinema.description || "Chưa có mô tả."}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setViewCinema(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
