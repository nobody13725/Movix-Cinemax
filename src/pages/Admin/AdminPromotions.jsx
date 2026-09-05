import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountPercent: 20,
    maxDiscount: 30000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "2026-12-31",
    usageLimit: 500,
    filmTitle: "Tất cả phim",
    status: "Đang hoạt động",
  });

  const loadData = () => {
    setPromotions(dbService.getPromotions());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleOpenAdd = () => {
    setEditingPromo(null);
    setFormData({
      code: "",
      description: "",
      discountPercent: 20,
      maxDiscount: 30000,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "2026-12-31",
      usageLimit: 500,
      filmTitle: "Tất cả phim",
      status: "Đang hoạt động",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPromo(p);
    setFormData({
      code: p.code || "",
      description: p.description || "",
      discountPercent: p.discountPercent || 20,
      maxDiscount: p.maxDiscount || 30000,
      startDate: p.startDate || new Date().toISOString().slice(0, 10),
      endDate: p.endDate || "2026-12-31",
      usageLimit: p.usageLimit || 500,
      filmTitle: p.filmTitle || "Tất cả phim",
      status: p.status || "Đang hoạt động",
    });
    setShowModal(true);
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã khuyến mãi "${code}"?`)) {
      dbService.deletePromotion(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      discountPercent: Number(formData.discountPercent),
      maxDiscount: Number(formData.maxDiscount),
      usageLimit: Number(formData.usageLimit),
    };

    if (editingPromo) {
      dbService.updatePromotion(editingPromo.id, payload);
    } else {
      dbService.addPromotion(payload);
    }
    setShowModal(false);
  };

  const activeCount = promotions.filter((p) => p.status === "Đang hoạt động").length;
  const expiredCount = promotions.filter((p) => p.status === "Hết hạn").length;

  const filteredPromotions = promotions.filter(
    (p) =>
      p.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý khuyến mãi</h2>
          <p className="admin-subtitle">Tạo và quản lý voucher, mã giảm giá vé phim (UC18, Hình 40, 41)</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Thêm khuyến mãi mới
        </button>
      </div>

      {/* Stats Cards Section 3.2.19 */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Tổng số khuyến mãi</div>
          <div className="stat-number">{promotions.length}</div>
          <div className="stat-trend positive">Chiến dịch</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đang hoạt động</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>{activeCount}</div>
          <div className="stat-sub">Người dùng có thể áp dụng</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Lượt đã sử dụng</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>
            {promotions.reduce((acc, curr) => acc + (curr.usedCount || 0), 0)}
          </div>
          <div className="stat-sub">Tổng lượt claim</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Hết hạn / Tạm ngưng</div>
          <div className="stat-number" style={{ color: "var(--red-500)" }}>{expiredCount}</div>
          <div className="stat-sub">Không thể áp dụng</div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="admin-card" style={{ marginTop: 16, padding: "12px 18px" }}>
        <input
          type="text"
          className="input-control"
          placeholder="🔍 Tìm kiếm mã khuyến mãi hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8 }}
        />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã khuyến mãi</th>
              <th>Giảm giá</th>
              <th>Giảm tối đa</th>
              <th>Số lượng / Đã dùng</th>
              <th>Phim áp dụng</th>
              <th>Thời gian áp dụng</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 120 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.map((p) => (
              <tr key={p.id}>
                <td>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: 14,
                      background: "var(--brand-50)",
                      color: "var(--brand-700)",
                      padding: "4px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {p.code}
                  </span>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{p.description}</div>
                </td>
                <td>
                  <strong style={{ color: "var(--green-500)", fontSize: 15 }}>{p.discountPercent}%</strong>
                </td>
                <td>{(p.maxDiscount || 0).toLocaleString("vi-VN")}đ</td>
                <td>
                  <div>
                    {p.usedCount || 0} / {p.usageLimit || "∞"}
                  </div>
                  <div
                    style={{
                      width: 80,
                      height: 5,
                      background: "var(--ink-100)",
                      borderRadius: 999,
                      marginTop: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, ((p.usedCount || 0) / (p.usageLimit || 100)) * 100)}%`,
                        height: "100%",
                        background: "var(--brand-500)",
                      }}
                    />
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--ink-700)" }}>{p.filmTitle || "Tất cả phim"}</td>
                <td style={{ fontSize: 12.5, color: "var(--ink-500)" }}>
                  {p.startDate} → {p.endDate}
                </td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "Đang hoạt động" ? "badge-green" : "badge-red"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="icon-action-btn edit"
                      title="Sửa khuyến mãi"
                      onClick={() => handleOpenEdit(p)}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-action-btn delete"
                      title="Xóa khuyến mãi"
                      onClick={() => handleDelete(p.id, p.code)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPromotions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không có mã khuyến mãi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Khuyến mãi */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <h3>{editingPromo ? "Sửa mã khuyến mãi" : "Thêm khuyến mãi mới"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              <div>
                <label className="form-label">Mã khuyến mãi (Code) *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%", textTransform: "uppercase", fontWeight: 700 }}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ví dụ: MOVIX50, CHAOMOI..."
                />
              </div>

              <div>
                <label className="form-label">Mô tả chương trình *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%" }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Giảm 20% cho đơn từ 100k"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">% Giảm giá *</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Giảm tối đa (VND) *</label>
                  <input
                    type="number"
                    step="5000"
                    required
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Giới hạn số lượt dùng</label>
                  <input
                    type="number"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Hết hạn">Hết hạn</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromo ? "Cập nhật" : "Tạo khuyến mãi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
