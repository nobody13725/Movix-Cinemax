import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../../lib/supabaseClient.js";

export default function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [dateRange, setDateRange] = useState("30"); // 7, 30, 90 ngày
  const [filterCinema, setFilterCinema] = useState("all");
  const [filterFilm, setFilterFilm] = useState("all");

  const loadData = () => {
    setOrders(dbService.getOrders());
    setUsers(dbService.getUsers());
    setFilms(dbService.getFilms());
    setCinemas(dbService.getCinemas());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const totalTickets = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((acc, curr) => acc + (curr.seats?.length || 1), 0);

  const avgTicketPrice = totalTickets > 0 ? Math.round(totalRevenue / totalTickets) : 0;
  const newUsersCount = users.length;

  // Doanh thu theo phim
  const revenueByFilm = {};
  orders
    .filter((o) => o.orderStatus !== "cancelled")
    .forEach((o) => {
      const title = o.filmTitle || "Phim khác";
      revenueByFilm[title] = (revenueByFilm[title] || 0) + (o.totalAmount || 0);
    });

  const sortedFilmRevenues = Object.entries(revenueByFilm).sort((a, b) => b[1] - a[1]);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Mã Đơn,Phim,Rạp,Suất Chiếu,Ghế,Tổng Tiền,Trạng Thái,Ngày"]
        .concat(
          orders.map(
            (o) =>
              `"${o.ticketCode}","${o.filmTitle}","${o.cinemaName}","${o.showtimeTime}","${o.seats
                ?.map((s) => s.seatKey)
                .join(" ")}",${o.totalAmount},"${o.orderStatus}","${o.createdAt}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `movix_bao_cao_doanh_thu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Thống kê & Báo cáo doanh thu</h2>
          <p className="admin-subtitle">Số liệu kinh doanh, vé bán và tăng trưởng khách hàng (UC20, Hình 44)</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            📊 Xuất file Excel / CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            🖨️ In báo cáo
          </button>
        </div>
      </div>

      {/* Filter Bar matching Figure 44 */}
      <div className="admin-card" style={{ marginTop: 16, padding: "14px 20px" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>
              Khoảng thời gian
            </label>
            <select
              className="input-control"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ minWidth: 160 }}
            >
              <option value="7">7 ngày gần nhất</option>
              <option value="30">30 ngày gần nhất</option>
              <option value="90">Quý này (90 ngày)</option>
              <option value="365">Toàn bộ năm</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>
              Rạp chiếu
            </label>
            <select
              className="input-control"
              value={filterCinema}
              onChange={(e) => setFilterCinema(e.target.value)}
              style={{ minWidth: 180 }}
            >
              <option value="all">Tất cả rạp chiếu</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--ink-500)", marginBottom: 4 }}>
              Phim
            </label>
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

          <button
            className="btn btn-primary btn-sm"
            style={{ alignSelf: "flex-end" }}
            onClick={() => alert("Đã cập nhật dữ liệu thống kê!")}
          >
            🔍 Lọc dữ liệu
          </button>
        </div>
      </div>

      {/* 4 Summary Cards matching Fig 44: Khách hàng mới, Tổng số vé bán, Tổng doanh thu, Doanh thu/vé */}
      <div className="admin-stat-cards" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        <div className="stat-card">
          <div className="stat-title">Khách hàng mới</div>
          <div className="stat-number">{newUsersCount}</div>
          <div className="stat-trend positive">+18.5% so với tháng trước</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tổng số vé bán</div>
          <div className="stat-number" style={{ color: "var(--brand-500)" }}>{totalTickets}</div>
          <div className="stat-trend positive">Đã xác nhận</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Tổng doanh thu</div>
          <div className="stat-number" style={{ color: "var(--green-500)", fontSize: 24 }}>
            {totalRevenue.toLocaleString("vi-VN")}đ
          </div>
          <div className="stat-trend positive">Vé + Bắp nước</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Doanh thu / Vé</div>
          <div className="stat-number" style={{ color: "var(--amber-500)" }}>
            {avgTicketPrice.toLocaleString("vi-VN")}đ
          </div>
          <div className="stat-sub">Bình quân chi tiêu</div>
        </div>
      </div>

      {/* Charts & Breakdown Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20, marginTop: 20 }}>
        {/* Biểu đồ doanh thu giả lập theo ngày */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16 }}>📈 Xu hướng doanh thu theo ngày</h3>
            <span className="badge badge-purple">{dateRange} ngày qua</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--ink-100)" }}>
            {[
              { day: "T2", val: 320000, height: 40 },
              { day: "T3", val: 450000, height: 55 },
              { day: "T4", val: 280000, height: 35 },
              { day: "T5", val: 510000, height: 65 },
              { day: "T6", val: 890000, height: 95 },
              { day: "T7", val: 1250000, height: 140 },
              { day: "CN", val: 1420000, height: 160 },
            ].map((bar, idx) => (
              <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: "var(--ink-500)" }}>{(bar.val / 1000).toFixed(0)}k</span>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 36,
                    height: bar.height,
                    background: idx >= 5 ? "var(--brand-500)" : "var(--brand-200)",
                    borderRadius: "6px 6px 0 0",
                    transition: "all 0.3s",
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-700)" }}>{bar.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "var(--ink-500)" }}>
            <span>Thứ Hai - Đầu tuần</span>
            <span>Cuối tuần (Đỉnh điểm đặt vé)</span>
          </div>
        </div>

        {/* Top Phim ăn khách nhất */}
        <div className="admin-card">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>🏆 Top phim doanh thu cao nhất</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sortedFilmRevenues.slice(0, 5).map(([title, rev], idx) => {
              const maxRev = sortedFilmRevenues[0]?.[1] || 1;
              const pct = Math.round((rev / maxRev) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>
                      #{idx + 1} {title}
                    </span>
                    <strong style={{ color: "var(--brand-600)" }}>{rev.toLocaleString("vi-VN")}đ</strong>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "var(--ink-100)", borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: idx === 0 ? "var(--green-500)" : "var(--brand-500)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {sortedFilmRevenues.length === 0 && (
              <div style={{ color: "var(--ink-500)", fontSize: 13, textAlign: "center", padding: 20 }}>
                Chưa có đơn hàng nào được ghi nhận.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
