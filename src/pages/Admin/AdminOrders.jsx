import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadData = () => {
    setOrders(dbService.getOrders());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    dbService.updateOrderStatus(id, newStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  const confirmedCount = orders.filter((o) => o.orderStatus === "confirmed").length;
  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;
  const usedCount = orders.filter((o) => o.orderStatus === "used").length;
  const cancelledCount = orders.filter((o) => o.orderStatus === "cancelled").length;

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "all" && o.orderStatus !== filterStatus) return false;
    const q = search.toLowerCase();
    return (
      o.ticketCode?.toLowerCase().includes(q) ||
      o.userName?.toLowerCase().includes(q) ||
      o.filmTitle?.toLowerCase().includes(q) ||
      o.cinemaName?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="badge badge-green">Đã thanh toán</span>;
      case "pending":
        return <span className="badge badge-amber">Chờ thanh toán</span>;
      case "used":
        return <span className="badge badge-purple">Đã sử dụng</span>;
      case "cancelled":
        return <span className="badge badge-red">Đã hủy / Hoàn vé</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản lý đặt vé</h2>
          <p className="admin-subtitle">Danh sách vé đã đặt, thông tin thanh toán & xử lý tình huống vé (UC19, Hình 42, 43)</p>
        </div>
      </div>

      {/* Stats Cards Section 3.2.18 */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Đã thanh toán (Sẵn sàng)</div>
          <div className="stat-number" style={{ color: "var(--green-500)" }}>{confirmedCount}</div>
          <div className="stat-trend positive">Đang chờ xem</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Chờ thanh toán</div>
          <div className="stat-number" style={{ color: "var(--amber-500)" }}>{pendingCount}</div>
          <div className="stat-sub">Đang giữ chỗ</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đã sử dụng (Check-in)</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>{usedCount}</div>
          <div className="stat-sub">Vé đã soát</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Đã hủy / Hoàn tiền</div>
          <div className="stat-number" style={{ color: "var(--red-500)" }}>{cancelledCount}</div>
          <div className="stat-sub">Hủy bởi khách/admin</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-card" style={{ marginTop: 16, padding: "14px 20px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>
              Tìm kiếm (Mã vé, Khách hàng, Tên phim...)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="🔍 Ví dụ: MVX-92813 hoặc Avatar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>
              Trạng thái đơn hàng
            </label>
            <select
              className="input-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ minWidth: 180 }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="confirmed">Đã thanh toán (Sắp chiếu)</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="used">Đã sử dụng</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ alignSelf: "flex-end" }}
            onClick={() => {
              setSearch("");
              setFilterStatus("all");
            }}
          >
            ↺ Đặt lại
          </button>
        </div>
      </div>

      {/* Table Section 3.2.18 */}
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Bộ phim</th>
              <th>Ghế ngồi</th>
              <th>Suất chiếu</th>
              <th>Rạp & Phòng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th style={{ textAlign: "right", width: 140 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => (
              <tr key={ord.id}>
                <td>
                  <span style={{ fontWeight: 700, color: "var(--brand-600)", fontFamily: "monospace" }}>
                    {ord.ticketCode}
                  </span>
                  <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{ord.paymentMethod}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{ord.userName || "Khách vãng lai"}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{ord.phone || "—"}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{ord.filmTitle}</td>
                <td>
                  <span className="badge badge-purple">
                    {ord.seats?.map((s) => s.seatKey).join(", ") || "Chưa chọn"}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>
                  <div>{ord.showtimeTime}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>{ord.showtimeDate}</div>
                </td>
                <td style={{ fontSize: 12.5, color: "var(--ink-700)" }}>
                  <div>{ord.cinemaName}</div>
                  <div style={{ color: "var(--ink-500)" }}>{ord.roomName}</div>
                </td>
                <td>
                  <strong style={{ color: "var(--ink-900)" }}>
                    {(ord.totalAmount || 0).toLocaleString("vi-VN")}đ
                  </strong>
                </td>
                <td>{getStatusBadge(ord.orderStatus)}</td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="icon-action-btn view"
                      title="Xem chi tiết & QR vé"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      👁️
                    </button>
                    {ord.orderStatus === "confirmed" && (
                      <>
                        <button
                          className="icon-action-btn"
                          title="Đánh dấu đã soát vé (Sử dụng)"
                          onClick={() => handleUpdateStatus(ord.id, "used")}
                          style={{ background: "var(--green-100)", color: "#197a55" }}
                        >
                          ✓
                        </button>
                        <button
                          className="icon-action-btn delete"
                          title="Hủy vé / Hoàn tiền"
                          onClick={() => {
                            if (window.confirm(`Hủy vé ${ord.ticketCode} và hoàn tiền lại cho khách?`)) {
                              handleUpdateStatus(ord.id, "cancelled");
                            }
                          }}
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--ink-500)" }}>
                  Không tìm thấy đơn đặt vé nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chi tiết vé & QR Code (UC19, UC09) */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div style={{ textAlign: "center", paddingBottom: 12, borderBottom: "1px dashed var(--ink-100)" }}>
              <span className="badge badge-purple" style={{ marginBottom: 8 }}>VÉ ĐIỆN TỬ CHÍNH THỨC</span>
              <h3 style={{ fontSize: 20, color: "var(--brand-600)", fontFamily: "monospace" }}>
                {selectedOrder.ticketCode}
              </h3>
              <div style={{ marginTop: 12 }}>
                <img
                  src={selectedOrder.ticketQrUrl}
                  alt="QR Code Vé"
                  style={{ width: 140, height: 140, margin: "0 auto", borderRadius: 8, border: "2px solid var(--ink-100)", padding: 4 }}
                />
              </div>
              <p style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 6 }}>
                Quét mã này tại cửa rạp chiếu để check-in
              </p>
            </div>

            <div style={{ marginTop: 16, fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-700)" }}>
              <p><strong>Phim:</strong> {selectedOrder.filmTitle}</p>
              <p><strong>Rạp chiếu:</strong> {selectedOrder.cinemaName}</p>
              <p><strong>Phòng chiếu:</strong> {selectedOrder.roomName}</p>
              <p><strong>Suất chiếu:</strong> {selectedOrder.showtimeTime} ngày {selectedOrder.showtimeDate}</p>
              <p>
                <strong>Ghế ngồi:</strong>{" "}
                <span style={{ fontWeight: 700, color: "var(--brand-600)" }}>
                  {selectedOrder.seats?.map((s) => `${s.seatKey} (${s.type})`).join(", ")}
                </span>
              </p>
              {selectedOrder.comboFoods?.length > 0 && (
                <p>
                  <strong>Bắp nước:</strong>{" "}
                  {selectedOrder.comboFoods.map((c) => `${c.quantity}x ${c.name}`).join(", ")}
                </p>
              )}
              {selectedOrder.promotionCode && (
                <p>
                  <strong>Mã giảm giá:</strong> {selectedOrder.promotionCode} (-{selectedOrder.discountAmount?.toLocaleString("vi-VN")}đ)
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--ink-100)" }}>
                <span><strong>Tổng tiền thanh toán:</strong></span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--brand-600)" }}>
                  {(selectedOrder.totalAmount || 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
              <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.orderStatus)}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10 }}>
              {selectedOrder.orderStatus === "confirmed" && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: "var(--red-500)" }}
                  onClick={() => {
                    handleUpdateStatus(selectedOrder.id, "cancelled");
                  }}
                >
                  ✕ Hủy / Hoàn vé
                </button>
              )}
              <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
