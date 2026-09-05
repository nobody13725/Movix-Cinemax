import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";
import { FALLBACK_BANNER, handleImageError } from "../../utils/imageFallback.js";

export default function AdminPromotions() {
  const [activeTab, setActiveTab] = useState("promos"); // "promos" | "banners"
  const [promotions, setPromotions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");

  // Promo modal state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    code: "",
    title: "",
    description: "",
    category: "Vé xem phim",
    discountPercent: 20,
    maxDiscount: 30000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "2026-12-31",
    usageLimit: 500,
    filmTitle: "Tất cả phim",
    bannerUrl: "",
    status: "Đang hoạt động",
  });

  // Banner modal state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    badge: "ƯU ĐÃI NỔI BẬT",
    badgeColor: "var(--brand-600)",
    title: "",
    tagline: "",
    description: "",
    promoCode: "",
    imageUrl: "",
    btnText: "Lấy ưu đãi ngay",
    targetTab: "movies",
  });

  const loadData = () => {
    setPromotions(dbService.getPromotions());
    setBanners(dbService.getBanners());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  // Handlers for Promotions
  const handleOpenAddPromo = () => {
    setEditingPromo(null);
    setPromoForm({
      code: "",
      title: "",
      description: "",
      category: "Vé xem phim",
      discountPercent: 20,
      maxDiscount: 30000,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "2026-12-31",
      usageLimit: 500,
      filmTitle: "Tất cả phim",
      bannerUrl: "",
      status: "Đang hoạt động",
    });
    setShowPromoModal(true);
  };

  const handleOpenEditPromo = (p) => {
    setEditingPromo(p);
    setPromoForm({
      code: p.code || "",
      title: p.title || "",
      description: p.description || "",
      category: p.category || "Vé xem phim",
      discountPercent: p.discountPercent || 20,
      maxDiscount: p.maxDiscount || 30000,
      startDate: p.startDate || new Date().toISOString().slice(0, 10),
      endDate: p.endDate || "2026-12-31",
      usageLimit: p.usageLimit || 500,
      filmTitle: p.filmTitle || "Tất cả phim",
      bannerUrl: p.bannerUrl || "",
      status: p.status || "Đang hoạt động",
    });
    setShowPromoModal(true);
  };

  const handleDeletePromo = (id, code) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã khuyến mãi "${code}"?`)) {
      dbService.deletePromotion(id);
    }
  };

  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!promoForm.code.trim()) return;

    const payload = {
      ...promoForm,
      code: promoForm.code.toUpperCase().trim(),
      discountPercent: Number(promoForm.discountPercent),
      maxDiscount: Number(promoForm.maxDiscount),
      usageLimit: Number(promoForm.usageLimit),
    };

    if (editingPromo) {
      dbService.updatePromotion(editingPromo.id, payload);
    } else {
      dbService.addPromotion(payload);
    }
    setShowPromoModal(false);
  };

  // Handlers for Banners
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      badge: "ƯU ĐÃI NỔI BẬT",
      badgeColor: "var(--brand-600)",
      title: "",
      tagline: "",
      description: "",
      promoCode: "",
      imageUrl: "",
      btnText: "Lấy ưu đãi ngay",
      targetTab: "movies",
    });
    setShowBannerModal(true);
  };

  const handleOpenEditBanner = (b) => {
    setEditingBanner(b);
    setBannerForm({
      badge: b.badge || "ƯU ĐÃI NỔI BẬT",
      badgeColor: b.badgeColor || "var(--brand-600)",
      title: b.title || "",
      tagline: b.tagline || "",
      description: b.description || "",
      promoCode: b.promoCode || "",
      imageUrl: b.imageUrl || "",
      btnText: b.btnText || "Lấy ưu đãi ngay",
      targetTab: b.targetTab || "movies",
    });
    setShowBannerModal(true);
  };

  const handleDeleteBanner = (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa banner quảng cáo "${title}"?`)) {
      dbService.deleteBanner(id);
    }
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) return;

    const payload = {
      ...bannerForm,
      promoCode: (bannerForm.promoCode || "").toUpperCase().trim(),
    };

    if (editingBanner) {
      dbService.updateBanner(editingBanner.id, payload);
    } else {
      dbService.addBanner(payload);
    }
    setShowBannerModal(false);
  };

  const activeCount = promotions.filter((p) => p.status === "Đang hoạt động").length;
  const expiredCount = promotions.filter((p) => p.status === "Hết hạn").length;

  const filteredPromotions = promotions.filter(
    (p) =>
      p.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý Khuyến mãi & Banner Quảng cáo</h2>
          <p className="admin-subtitle">
            Cấu hình voucher giảm giá, mã ưu đãi và banner quảng cáo trên trang chủ (UC18, Hình 40, 41)
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {activeTab === "promos" ? (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddPromo}>
              + Thêm mã khuyến mãi
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddBanner}>
              + Thêm banner quảng cáo
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: "flex", gap: 12, marginTop: 16, borderBottom: "1px solid var(--ink-200)", paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab("promos")}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            background: activeTab === "promos" ? "var(--brand-600)" : "var(--ink-100)",
            color: activeTab === "promos" ? "#fff" : "var(--ink-700)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🏷️</span> Mã Khuyến Mãi ({promotions.length})
        </button>

        <button
          onClick={() => setActiveTab("banners")}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            background: activeTab === "banners" ? "var(--brand-600)" : "var(--ink-100)",
            color: activeTab === "banners" ? "#fff" : "var(--ink-700)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🖼️</span> Banner Quảng Cáo ({banners.length})
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Mã khuyến mãi</div>
          <div className="stat-number">{promotions.length}</div>
          <div className="stat-trend positive">Đang triển khai</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Mã hoạt động</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>{activeCount}</div>
          <div className="stat-sub">Khách có thể dùng ngay</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Banner hiển thị</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>
            {banners.length}
          </div>
          <div className="stat-sub">Slider trang chủ</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Hết hạn / Tạm ngưng</div>
          <div className="stat-number" style={{ color: "var(--red-500)" }}>{expiredCount}</div>
          <div className="stat-sub">Cần gia hạn</div>
        </div>
      </div>

      {/* TAB 1: DANH SÁCH MÃ KHUYẾN MÃI */}
      {activeTab === "promos" && (
        <>
          <div className="admin-card" style={{ marginTop: 16, padding: "12px 18px" }}>
            <input
              type="text"
              className="input-control"
              placeholder="🔍 Tìm kiếm mã voucher, tiêu đề hoặc nội dung ưu đãi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8 }}
            />
          </div>

          <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã & Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>Mức giảm</th>
                  <th>Giảm tối đa</th>
                  <th>Lượt sử dụng</th>
                  <th>Thời gian áp dụng</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "right", width: 120 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {p.bannerUrl && (
                          <img
                            src={p.bannerUrl}
                            alt=""
                            onError={(e) => handleImageError(e, FALLBACK_BANNER)}
                            style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover" }}
                          />
                        )}
                        <div>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              fontSize: 13.5,
                              background: "var(--brand-50)",
                              color: "var(--brand-700)",
                              padding: "2px 6px",
                              borderRadius: 4,
                            }}
                          >
                            {p.code}
                          </span>
                          <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 3 }}>
                            {p.title || p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ fontSize: 11.5 }}>
                        {p.category || "Vé xem phim"}
                      </span>
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
                    <td style={{ fontSize: 12.5, color: "var(--ink-600)" }}>
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
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleOpenEditPromo(p)}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: "var(--red-500)" }}
                          onClick={() => handleDeletePromo(p.id, p.code)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: DANH SÁCH BANNER QUẢNG CÁO */}
      {activeTab === "banners" && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
            {banners.map((b) => (
              <div
                key={b.id}
                style={{
                  background: "var(--ink-0)",
                  border: "1px solid var(--ink-200)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
                  <img
                    src={b.imageUrl || FALLBACK_BANNER}
                    alt={b.title}
                    onError={(e) => handleImageError(e, FALLBACK_BANNER)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: b.badgeColor || "var(--brand-600)",
                      color: "#fff",
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {b.badge || "ƯU ĐÃI"}
                  </div>
                  {b.promoCode && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(6px)",
                        color: "#fef08a",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.5px",
                      }}
                    >
                      MÃ: {b.promoCode}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, color: "#fff" }}>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{b.tagline}</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{b.title}</div>
                  </div>
                </div>

                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: 13, color: "var(--ink-600)", lineHeight: 1.5, margin: "0 0 14px", flex: 1 }}>
                    {b.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--ink-100)",
                      paddingTop: 12,
                    }}
                  >
                    <span style={{ fontSize: 12, color: "var(--ink-500)" }}>
                      Nút: <strong>{b.btnText || "Đặt vé ngay"}</strong>
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditBanner(b)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--red-500)" }}
                        onClick={() => handleDeleteBanner(b.id, b.title)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Thêm/Sửa Mã Khuyến mãi */}
      {showPromoModal && (
        <div className="modal-overlay" onClick={() => setShowPromoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3>{editingPromo ? "Sửa mã khuyến mãi" : "Thêm khuyến mãi mới"}</h3>
            <form onSubmit={handleSavePromo} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Mã code (Voucher) *</label>
                  <input
                    required
                    className="input-control"
                    style={{ width: "100%", textTransform: "uppercase", fontWeight: 700 }}
                    value={promoForm.code}
                    onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                    placeholder="VD: MOVIX50, CHAOMOI..."
                  />
                </div>
                <div>
                  <label className="form-label">Danh mục ưu đãi</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={promoForm.category}
                    onChange={(e) => setPromoForm({ ...promoForm, category: e.target.value })}
                  >
                    <option value="Vé xem phim">Vé xem phim</option>
                    <option value="Thành viên">Thành viên</option>
                    <option value="Combo Bắp Nước">Combo Bắp Nước</option>
                    <option value="Ví điện tử & Ngân hàng">Ví điện tử & Ngân hàng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Tiêu đề chương trình</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  placeholder="VD: Chào Bạn Mới - Giảm 50% Vé Đầu Tiên"
                />
              </div>

              <div>
                <label className="form-label">Mô tả chi tiết *</label>
                <textarea
                  required
                  rows={2}
                  className="input-control"
                  style={{ width: "100%", resize: "vertical" }}
                  value={promoForm.description}
                  onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                  placeholder="Mô tả quyền lợi và điều kiện áp dụng..."
                />
              </div>

              <div>
                <label className="form-label">Link ảnh banner (Tùy chọn)</label>
                <input
                  type="url"
                  className="input-control"
                  style={{ width: "100%" }}
                  value={promoForm.bannerUrl}
                  onChange={(e) => setPromoForm({ ...promoForm, bannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
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
                    value={promoForm.discountPercent}
                    onChange={(e) => setPromoForm({ ...promoForm, discountPercent: e.target.value })}
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
                    value={promoForm.maxDiscount}
                    onChange={(e) => setPromoForm({ ...promoForm, maxDiscount: e.target.value })}
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
                    value={promoForm.startDate}
                    onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={promoForm.endDate}
                    onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Giới hạn lượt dùng</label>
                  <input
                    type="number"
                    className="input-control"
                    style={{ width: "100%" }}
                    value={promoForm.usageLimit}
                    onChange={(e) => setPromoForm({ ...promoForm, usageLimit: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={promoForm.status}
                    onChange={(e) => setPromoForm({ ...promoForm, status: e.target.value })}
                  >
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Hết hạn">Hết hạn</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPromoModal(false)}>
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

      {/* Modal Thêm/Sửa Banner Quảng Cáo */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3>{editingBanner ? "Sửa banner quảng cáo" : "Thêm banner quảng cáo mới"}</h3>
            <form onSubmit={handleSaveBanner} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Huy hiệu (Badge)</label>
                  <input
                    className="input-control"
                    style={{ width: "100%" }}
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="VD: ƯU ĐÃI NỔI BẬT, BOM TẤN..."
                  />
                </div>
                <div>
                  <label className="form-label">Mã voucher liên kết</label>
                  <input
                    className="input-control"
                    style={{ width: "100%", textTransform: "uppercase", fontWeight: 700 }}
                    value={bannerForm.promoCode}
                    onChange={(e) => setBannerForm({ ...bannerForm, promoCode: e.target.value })}
                    placeholder="VD: CHAOMOI, MOVIX50..."
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Tiêu đề chính *</label>
                <input
                  required
                  className="input-control"
                  style={{ width: "100%", fontWeight: 700 }}
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="VD: Siêu Đại Tiệc Điện Ảnh Movix 2026"
                />
              </div>

              <div>
                <label className="form-label">Dòng giới thiệu ngắn (Tagline)</label>
                <input
                  className="input-control"
                  style={{ width: "100%" }}
                  value={bannerForm.tagline}
                  onChange={(e) => setBannerForm({ ...bannerForm, tagline: e.target.value })}
                  placeholder="VD: Giảm ngay 50% vé cho thành viên mới"
                />
              </div>

              <div>
                <label className="form-label">Mô tả quảng cáo</label>
                <textarea
                  rows={2}
                  className="input-control"
                  style={{ width: "100%", resize: "vertical" }}
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  placeholder="Nội dung khuyến mãi hoặc thông điệp quảng bá..."
                />
              </div>

              <div>
                <label className="form-label">Link ảnh banner nền (URL)</label>
                <input
                  type="url"
                  className="input-control"
                  style={{ width: "100%" }}
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Chữ hiển thị trên nút</label>
                  <input
                    className="input-control"
                    style={{ width: "100%" }}
                    value={bannerForm.btnText}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnText: e.target.value })}
                    placeholder="VD: Đặt vé áp dụng mã"
                  />
                </div>
                <div>
                  <label className="form-label">Chuyển hướng đến</label>
                  <select
                    className="input-control"
                    style={{ width: "100%" }}
                    value={bannerForm.targetTab}
                    onChange={(e) => setBannerForm({ ...bannerForm, targetTab: e.target.value })}
                  >
                    <option value="movies">Trang phim</option>
                    <option value="promotions">Trang khuyến mãi</option>
                    <option value="showtimes">Lịch chiếu</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBannerModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBanner ? "Cập nhật" : "Tạo banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
