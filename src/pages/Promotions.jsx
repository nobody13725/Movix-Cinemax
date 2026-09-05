import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import { FALLBACK_BANNER, handleImageError } from "../utils/imageFallback.js";

export default function Promotions({ go, goBack }) {
  const [promotions, setPromotions] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [activeTermsPromo, setActiveTermsPromo] = useState(null);

  const loadData = () => {
    setPromotions(dbService.getPromotions());
    setBanners(dbService.getBanners());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const categories = [
    { id: "all", label: "Tất cả ưu đãi", icon: "✨" },
    { id: "Vé xem phim", label: "Vé xem phim", icon: "🎟️" },
    { id: "Thành viên", label: "Thành viên", icon: "👑" },
    { id: "Combo Bắp Nước", label: "Combo Bắp Nước", icon: "🍿" },
    { id: "Ví điện tử & Ngân hàng", label: "Ví & Ngân hàng", icon: "💳" },
  ];

  const filteredPromos = promotions.filter((p) => {
    // Chỉ hiển thị các ưu đãi đang hoạt động
    const status = (p.status || "").toLowerCase();
    const isActive = status.includes("hoạt động") || status.includes("active") || !p.status;
    if (!isActive) return false;

    // Lọc theo danh mục
    if (selectedCat !== "all" && p.category !== selectedCat) return false;

    // Lọc theo từ khóa tìm kiếm
    if (search.trim()) {
      const q = search.toLowerCase();
      const codeMatch = (p.code || "").toLowerCase().includes(q);
      const titleMatch = (p.title || "").toLowerCase().includes(q);
      const descMatch = (p.description || "").toLowerCase().includes(q);
      if (!codeMatch && !titleMatch && !descMatch) return false;
    }

    return true;
  });

  const handleCopy = (code) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2200);
    } catch {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2200);
    }
  };

  const handleUseCode = (code) => {
    go("movies", { promoCode: code });
  };

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ padding: "16px 0", fontSize: 13, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ cursor: "pointer" }} onClick={() => go("home")}>Trang chủ</span>
        <span>/</span>
        <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>Khuyến mãi & Ưu đãi</span>
      </div>

      {/* Header Banner Showcase */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          color: "#fff",
          padding: "36px 32px",
          marginBottom: 32,
          boxShadow: "0 10px 30px rgba(49, 46, 129, 0.25)",
        }}
      >
        <div style={{ maxWidth: 650, position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: 14,
            }}
          >
            <span>🎉</span> ĐẠI TIỆC VOUCHER & QUẢNG CÁO MOVIX
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px", color: "#fff", lineHeight: 1.25 }}>
            Ưu Đãi Hấp Dẫn - Xem Phim Thả Ga
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: 0 }}>
            Thu thập mã giảm giá vé phim lên đến 50%, voucher bắp nước giòn rụm và ngập tràn ưu đãi độc quyền từ các đối tác thanh toán hàng đầu.
          </p>
        </div>

        {/* Decorative graphic background */}
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -30,
            fontSize: 180,
            opacity: 0.12,
            userSelect: "none",
            pointerEvents: "none",
            transform: "rotate(-10deg)",
          }}
        >
          🎟️
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: selectedCat === cat.id ? "1px solid var(--brand-600)" : "1px solid var(--ink-200)",
                background: selectedCat === cat.id ? "var(--brand-600)" : "var(--ink-0)",
                color: selectedCat === cat.id ? "#fff" : "var(--ink-700)",
                boxShadow: selectedCat === cat.id ? "0 4px 12px rgba(79, 70, 229, 0.25)" : "none",
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", minWidth: 260 }}>
          <input
            type="text"
            className="input-control"
            placeholder="Tìm theo mã (vd: MOVIX50, CHAOMOI)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", paddingLeft: 34, fontSize: 13.5 }}
          />
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "var(--ink-400)",
            }}
          >
            🔍
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "var(--ink-400)",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid thẻ khuyến mãi */}
      {filteredPromos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {filteredPromos.map((p) => {
            const isCopied = copiedCode === p.code;
            const banner = p.bannerUrl || FALLBACK_BANNER;

            return (
              <div
                key={p.id}
                style={{
                  background: "var(--ink-0)",
                  border: "1px solid var(--ink-200)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)";
                }}
              >
                {/* Banner Photo Header */}
                <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
                  <img
                    src={banner}
                    alt={p.title || p.description}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_BANNER)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(16, 17, 34, 0.8) 0%, transparent 60%)",
                    }}
                  />

                  {/* Badge % giảm */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "var(--red-500)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: 13,
                      boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                    }}
                  >
                    GIẢM {p.discountPercent}%
                  </div>

                  {/* Category Pill */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 14,
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {p.category || "Ưu đãi hot"}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "18px 18px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3
                    style={{
                      fontSize: 16.5,
                      fontWeight: 700,
                      margin: "0 0 8px",
                      color: "var(--ink-900)",
                      lineHeight: 1.35,
                    }}
                  >
                    {p.title || p.code}
                  </h3>

                  <p
                    style={{
                      fontSize: 13.5,
                      color: "var(--ink-600)",
                      lineHeight: 1.5,
                      margin: "0 0 14px",
                      flex: 1,
                    }}
                  >
                    {p.description}
                  </p>

                  {/* Details metadata */}
                  <div
                    style={{
                      padding: "8px 12px",
                      background: "var(--ink-50)",
                      borderRadius: 8,
                      fontSize: 12.5,
                      color: "var(--ink-600)",
                      marginBottom: 16,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Giảm tối đa:</span>
                      <strong style={{ color: "var(--ink-900)" }}>
                        {(p.maxDiscount || 0).toLocaleString("vi-VN")}đ
                      </strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Hạn áp dụng:</span>
                      <span>{p.endDate || "31/12/2026"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Áp dụng cho:</span>
                      <span>{p.filmTitle || "Tất cả phim"}</span>
                    </div>
                  </div>

                  {/* Promo Code Copy Bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 6px 6px 12px",
                      background: "var(--brand-50)",
                      border: "1.5px dashed var(--brand-300)",
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>🏷️</span>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          letterSpacing: "0.8px",
                          color: "var(--brand-700)",
                          userSelect: "all",
                        }}
                      >
                        {p.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(p.code)}
                      style={{
                        padding: "5px 12px",
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        background: isCopied ? "var(--green-600)" : "var(--brand-600)",
                        color: "#fff",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isCopied ? "✓ Đã sao chép" : "Sao chép mã"}
                    </button>
                  </div>

                  {/* CTA Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setActiveTermsPromo(p)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: 12.5 }}
                    >
                      Điều kiện
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseCode(p.code)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 2, fontSize: 12.5, fontWeight: 700 }}
                    >
                      Dùng mã ngay →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            background: "var(--ink-50)",
            borderRadius: 14,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h3 style={{ margin: "0 0 8px" }}>Không tìm thấy khuyến mãi phù hợp</h3>
          <p style={{ color: "var(--ink-500)", margin: "0 0 16px" }}>
            Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục ưu đãi khác
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedCat("all");
              setSearch("");
            }}
          >
            Xem tất cả ưu đãi
          </button>
        </div>
      )}

      {/* Banner Quảng Cáo & Đối Tác Tài Trợ */}
      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>Đối Tác Tài Trợ & Quảng Cáo</h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", margin: 0 }}>
            Chương trình ưu đãi hợp tác chiến lược giữa Movix và các đối tác công nghệ, ngân hàng
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {/* Partner Ad 1 */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              background: "linear-gradient(135deg, #a21caf, #4c1d95)",
              color: "#fff",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 140,
              boxShadow: "0 4px 14px rgba(162, 28, 175, 0.2)",
            }}
          >
            <div>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                VÍ ĐIỆN TỬ MOMO
              </span>
              <h4 style={{ color: "#fff", fontSize: 16, margin: "10px 0 4px", fontWeight: 700 }}>
                Hoàn tiền đến 15.000đ khi quét mã MoMo
              </h4>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                Áp dụng cho mọi hóa đơn đặt vé phim và combo bắp nước tại Movix. Nhập mã MOMO15.
              </p>
            </div>
            <button
              onClick={() => handleUseCode("MOMO15")}
              style={{
                alignSelf: "flex-start",
                marginTop: 12,
                background: "#fff",
                color: "#a21caf",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Lấy mã MOMO15 →
            </button>
          </div>

          {/* Partner Ad 2 */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              background: "linear-gradient(135deg, #0284c7, #1e3a8a)",
              color: "#fff",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 140,
              boxShadow: "0 4px 14px rgba(2, 132, 199, 0.2)",
            }}
          >
            <div>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                VNPAY-QR
              </span>
              <h4 style={{ color: "#fff", fontSize: 16, margin: "10px 0 4px", fontWeight: 700 }}>
                Giảm ngay 20.000đ cho đơn từ 150.000đ
              </h4>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                Thanh toán qua ứng dụng ngân hàng và ví VNPAY. Nhanh chóng, tiện lợi, bảo mật tuyệt đối.
              </p>
            </div>
            <button
              onClick={() => go("movies")}
              style={{
                alignSelf: "flex-start",
                marginTop: 12,
                background: "#fff",
                color: "#0284c7",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Đặt vé thanh toán VNPAY →
            </button>
          </div>

          {/* Partner Ad 3 */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              background: "linear-gradient(135deg, #b45309, #78350f)",
              color: "#fff",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 140,
              boxShadow: "0 4px 14px rgba(180, 83, 9, 0.2)",
            }}
          >
            <div>
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                PHÒNG CHIẾU IMAX LASER
              </span>
              <h4 style={{ color: "#fff", fontSize: 16, margin: "10px 0 4px", fontWeight: 700 }}>
                Ưu đãi nâng tầm trải nghiệm điện ảnh
              </h4>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                Giảm 30.000đ với mã CINEVIP cho các suất chiếu bom tấn màn hình cong khổng lồ.
              </p>
            </div>
            <button
              onClick={() => handleUseCode("CINEVIP")}
              style={{
                alignSelf: "flex-start",
                marginTop: 12,
                background: "#fff",
                color: "#b45309",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Nhận mã CINEVIP →
            </button>
          </div>
        </div>
      </div>

      {/* Modal Điều kiện khuyến mãi */}
      {activeTermsPromo && (
        <div
          className="modal-overlay"
          onClick={() => setActiveTermsPromo(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 520,
              width: "100%",
              background: "var(--ink-0)",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span
                  style={{
                    background: "var(--brand-100)",
                    color: "var(--brand-700)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  MÃ: {activeTermsPromo.code}
                </span>
                <h3 style={{ margin: "8px 0 0", fontSize: 18 }}>{activeTermsPromo.title || activeTermsPromo.description}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTermsPromo(null)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--ink-400)" }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6, marginBottom: 20 }}>
              <p style={{ margin: "0 0 10px" }}>
                <strong>• Mức giảm:</strong> Giảm {activeTermsPromo.discountPercent}% (tối đa {(activeTermsPromo.maxDiscount || 0).toLocaleString("vi-VN")}đ).
              </p>
              <p style={{ margin: "0 0 10px" }}>
                <strong>• Thời hạn áp dụng:</strong> Từ {activeTermsPromo.startDate || "01/01/2026"} đến {activeTermsPromo.endDate || "31/12/2026"}.
              </p>
              <p style={{ margin: "0 0 10px" }}>
                <strong>• Phạm vi áp dụng:</strong> {activeTermsPromo.filmTitle || "Tất cả phim"} tại toàn bộ các rạp đối tác của Movix trên toàn quốc.
              </p>
              <p style={{ margin: "0 0 10px" }}>
                <strong>• Lượt sử dụng:</strong> {activeTermsPromo.usedCount || 0} / {activeTermsPromo.usageLimit || 1000} lượt đã dùng. Mỗi tài khoản người dùng có thể áp dụng 01 lần cho mỗi giao dịch.
              </p>
              <p style={{ margin: 0, color: "var(--ink-500)", fontSize: 13 }}>
                * Lưu ý: Không áp dụng đồng thời với các chương trình khuyến mãi đặc biệt khác cùng loại. Voucher không có giá trị quy đổi thành tiền mặt.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  handleCopy(activeTermsPromo.code);
                }}
              >
                {copiedCode === activeTermsPromo.code ? "✓ Đã sao chép" : "Sao chép mã"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const code = activeTermsPromo.code;
                  setActiveTermsPromo(null);
                  handleUseCode(code);
                }}
              >
                Sử dụng mã đặt vé ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
