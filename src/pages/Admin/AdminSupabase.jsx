import React, { useState, useEffect } from "react";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  getSupabaseClient,
  dbService,
} from "../../lib/supabaseClient.js";

export default function AdminSupabase() {
  const [config, setConfig] = useState({ url: "", anonKey: "" });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setConfig(getSupabaseConfig());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(config.url, config.anonKey);
    setTestResult({ ok: true, message: "Đã lưu cấu hình Supabase vào bộ nhớ ứng dụng!" });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await dbService.testRemoteConnection();
      if (res.ok) {
        setTestResult({ ok: true, message: "Kết nối thành công tới Supabase! Đã sẵn sàng đồng bộ." });
      } else {
        setTestResult({ ok: false, message: `Kết nối thất bại: ${res.error}` });
      }
    } catch (e) {
      setTestResult({ ok: false, message: `Lỗi: ${e.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePushSeed = async () => {
    setSyncStatus("Đang đẩy dữ liệu mẫu lên Supabase...");
    try {
      const res = await dbService.pushSeedToRemote();
      setSyncStatus(`Thành công! Đã đẩy ${res.count} phim và danh mục lên bảng Supabase.`);
    } catch (e) {
      setSyncStatus(`Lỗi khi đẩy dữ liệu: ${e.message}. Hãy đảm bảo bạn đã tạo bảng bằng file supabase_schema.sql trong SQL Editor của Supabase!`);
    }
  };

  const copySqlSchema = () => {
    const sqlPreview = `-- File: supabase_schema.sql (Có sẵn tại thư mục gốc dự án)
-- Bạn có thể mở file /supabase_schema.sql hoặc copy trực tiếp mã tạo 11 bảng chuẩn theo đặc tả:
-- users, categories, cities, cinemas, rooms, films, showtimes, comments, promotions, combofoods, orders
`;
    navigator.clipboard.writeText(sqlPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSchemaSnippet = `-- 11 BẢNG CHUẨN TRONG FILE /supabase_schema.sql
-- 1. users (id, username, full_name, email, password, phone, address, role, status)
-- 2. categories (id, title)
-- 3. cities (id, name)
-- 4. cinemas (id, name, address, avatar, description, city_id)
-- 5. rooms (id, cinema_id, name, seat_layout)
-- 6. films (id, title, rating, release_date, duration, age_rating, trailer, thumbnail, status)
-- 7. showtimes (id, film_id, cinema_id, room_id, start_time, end_time, base_price, seats)
-- 8. comments (id, user_id, film_id, rate, content, report, report_reason)
-- 9. promotions (id, code, description, discount_percent, max_discount, start_date, end_date)
-- 10. combofoods (id, name, image, price, description, status)
-- 11. orders (id, ticket_code, user_id, showtime_id, seats, total_amount, payment_method, order_status)`;

  return (
    <div className="admin-page">
      <div className="admin-header-row">
        <div>
          <h2>Quản Lý Cơ Sở Dữ Liệu & Supabase</h2>
          <p className="admin-subtitle">
            Cấu hình kết nối Supabase, tạo 11 bảng CSDL theo sơ đồ trang 88-92 và đồng bộ dữ liệu.
          </p>
        </div>
      </div>

      <div className="admin-grid-2col" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, marginTop: 20 }}>
        {/* Cấu hình Supabase */}
        <div className="admin-card">
          <h3 style={{ fontSize: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚡</span> Cấu hình Supabase API
          </h3>
          <form onSubmit={handleSave}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>
                Supabase Project URL
              </label>
              <input
                className="input-control"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--ink-100)", borderRadius: 8, fontSize: 14 }}
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
              />
              <span style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4, display: "block" }}>
                Lấy từ: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>
                Supabase Anon / Public Key
              </label>
              <textarea
                rows={3}
                className="input-control"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--ink-100)", borderRadius: 8, fontSize: 13, fontFamily: "monospace" }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
              />
              <span style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4, display: "block" }}>
                Lấy từ: Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon / public)
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button type="submit" className="btn btn-primary btn-sm">
                💾 Lưu cấu hình
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                {isTesting ? "Đang kiểm tra..." : "🔌 Kiểm tra kết nối"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePushSeed}
              >
                🚀 Đẩy dữ liệu mẫu lên Supabase
              </button>
            </div>
          </form>

          {testResult && (
            <div
              style={{
                marginTop: 16,
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 13.5,
                background: testResult.ok ? "var(--green-100)" : "var(--red-100)",
                color: testResult.ok ? "#197a55" : "#b3232a",
                border: `1px solid ${testResult.ok ? "#a3e9cb" : "#f8b4b7"}`,
              }}
            >
              {testResult.message}
            </div>
          )}

          {syncStatus && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                background: "var(--brand-50)",
                color: "var(--brand-700)",
              }}
            >
              {syncStatus}
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--ink-100)" }}>
            <h4 style={{ fontSize: 14, marginBottom: 8 }}>💡 Chế độ dữ liệu kép (Dual-Mode):</h4>
            <p style={{ fontSize: 13, color: "var(--ink-500)", lineHeight: 1.6 }}>
              Ứng dụng được thiết kế thông minh: Nếu chưa có key Supabase hoặc đang offline, hệ thống tự động lưu trữ và đồng bộ tức thì trên <strong>Local Repository</strong> (với toàn bộ 11 bảng và dữ liệu mẫu chuẩn theo tài liệu). Khi bạn cấu hình Supabase, hệ thống sẽ kết nối trực tiếp đến database PostgreSQL trên mây!
            </p>
          </div>
        </div>

        {/* Hướng dẫn SQL DDL Schema & Seed */}
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 16 }}>📜 File SQL Schema & Seed</h3>
            <button className="btn btn-sm btn-secondary" onClick={copySqlSchema}>
              {copied ? "✓ Đã copy" : "📋 Hướng dẫn tạo bảng"}
            </button>
          </div>

          <p style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 12 }}>
            Các file sau đã được tạo sẵn tại thư mục gốc dự án để bạn mở và copy chạy trực tiếp trong <strong>Supabase SQL Editor</strong>:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 12, background: "var(--ink-50)", borderRadius: 8, border: "1px solid var(--ink-100)" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--brand-600)" }}>📁 /supabase_schema.sql</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>
                Tạo 11 bảng đầy đủ khóa chính, khóa ngoại, kiểu dữ liệu theo trang 88-92.
              </div>
            </div>
            <div style={{ padding: 12, background: "var(--ink-50)", borderRadius: 8, border: "1px solid var(--ink-100)" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--green-500)" }}>📁 /supabase_seed.sql</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginTop: 2 }}>
                Chèn dữ liệu mẫu cho phim, rạp, phòng, suất chiếu, bắp nước, mã khuyến mãi, tài khoản admin/user.
              </div>
            </div>
          </div>

          <pre
            style={{
              background: "#1e1e2e",
              color: "#cdd6f4",
              padding: 14,
              borderRadius: 8,
              fontSize: 12,
              overflowX: "auto",
              maxHeight: 240,
              lineHeight: 1.5,
            }}
          >
            {sqlSchemaSnippet}
          </pre>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const data = dbService.exportDataJSON();
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `movix_data_export_${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
              }}
            >
              📥 Xuất dữ liệu (JSON)
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (window.confirm("Bạn có chắc chắn muốn khôi phục dữ liệu mẫu ban đầu?")) {
                  dbService.resetDefaultData();
                  alert("Đã đặt lại dữ liệu mẫu!");
                }
              }}
            >
              🔄 Khôi phục dữ liệu gốc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
