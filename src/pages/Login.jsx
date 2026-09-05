import React, { useState } from "react";
import { dbService } from "../lib/supabaseClient.js";

export default function Login({ go, goBack, onLogin, params }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");

  const sampleAccounts = [
    {
      role: "admin",
      label: "Quản trị viên (Admin)",
      identity: "admin@movix.vn",
      password: "123",
      badge: "Toàn quyền hệ thống",
      badgeColor: "var(--red-500)",
      icon: "🛡️",
    },
    {
      role: "customer",
      label: "Thành viên (Thắng Nguyễn)",
      identity: "thangnguyen13725@gmail.com",
      password: "123",
      badge: "Thành viên",
      badgeColor: "var(--brand-600)",
      icon: "👤",
    },
  ];

  function submit(e) {
    e.preventDefault();
    if (!form.identity.trim()) return setError("Vui lòng nhập email hoặc tên đăng nhập");
    if (!form.password) return setError("Vui lòng nhập mật khẩu");

    const users = dbService.getUsers();
    const cleanId = form.identity.trim().toLowerCase();

    // Tìm tài khoản theo email, username hoặc số điện thoại
    const user = users.find(
      (u) =>
        u.email?.toLowerCase() === cleanId ||
        u.username?.toLowerCase() === cleanId ||
        u.phone === form.identity.trim()
    );

    if (!user) {
      return setError("Tài khoản không tồn tại trên hệ thống. Vui lòng kiểm tra lại hoặc nhấn Đăng ký.");
    }

    // Kiểm tra mật khẩu (hỗ trợ mật khẩu lưu trong DB, và mật khẩu mặc định 123 / 123456)
    const validPassword =
      user.password === form.password ||
      form.password === "123" ||
      form.password === "123456";

    if (!validPassword) {
      return setError("Mật khẩu không chính xác. Mật khẩu mẫu mặc định là '123'.");
    }

    if (user.status === "Tạm khóa") {
      return setError("Tài khoản của bạn đang bị TẠM KHÓA do vi phạm quy chế hoặc theo yêu cầu Quản trị viên.");
    }

    setError("");
    onLogin(user);

    // Điều hướng theo đúng phân quyền
    if (user.role === "admin" || user.role === "administrator") {
      go(params?.redirect === "admin" ? "admin" : "admin");
    } else {
      // Người dùng thường không được chuyển vào admin dù redirect có là admin
      const target = params?.redirect === "admin" ? "profile" : params?.redirect || "home";
      go(target);
    }
  }

  function handleQuickLogin(acc) {
    const users = dbService.getUsers();
    let target = users.find(
      (u) =>
        u.email?.toLowerCase() === acc.identity.toLowerCase() ||
        u.username?.toLowerCase() === acc.identity.toLowerCase()
    );

    if (!target) {
      // Nếu chưa có, tạo theo mẫu an toàn
      target = {
        id: acc.role === "admin" ? "usr-admin-01" : `usr-${Date.now()}`,
        fullName: acc.label.replace(/\s*\(.*?\)/, ""),
        username: acc.identity.split("@")[0],
        email: acc.identity,
        role: acc.role,
        status: "Hoạt động",
      };
    }

    onLogin(target);
    if (target.role === "admin" || target.role === "administrator") {
      go("admin");
    } else {
      go("home");
    }
  }

  function fillAccount(acc) {
    setForm({ identity: acc.identity, password: acc.password });
    setError("");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div style={{ marginBottom: 12 }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => (typeof goBack === "function" ? goBack() : go("home"))}
            style={{ padding: "4px 8px", fontSize: 13, color: "var(--ink-600)", display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            ← Quay lại trang chủ
          </button>
        </div>

        <div className="auth-logo">
          <div className="brand-mark">🎬</div>
          <h2>Đăng nhập Movix</h2>
          <p>Hệ thống đặt vé xem phim & Quản trị phân quyền hoàn hảo</p>
        </div>

        {/* Bảng chọn tài khoản test nhanh theo đúng phân quyền */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-600)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
            ⚡ Chọn tài khoản thử nghiệm phân quyền:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sampleAccounts.map((acc) => (
              <div
                key={acc.identity}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: acc.role === "admin" ? "1px solid #fed7aa" : "1px solid var(--ink-200)",
                  background: acc.role === "admin" ? "#fffaf5" : "#f8fafc",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{acc.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-900)" }}>
                      {acc.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-500)" }}>
                      {acc.identity} • MK: {acc.password}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      fontSize: 11.5,
                      padding: "4px 8px",
                      background: "white",
                      border: "1px solid var(--ink-300)",
                    }}
                    onClick={() => fillAccount(acc)}
                    title="Điền thông tin vào form bên dưới"
                  >
                    Điền
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${acc.role === "admin" ? "btn-primary" : "btn-secondary"}`}
                    style={{
                      fontSize: 11.5,
                      padding: "4px 10px",
                      fontWeight: 600,
                    }}
                    onClick={() => handleQuickLogin(acc)}
                  >
                    Vào ngay →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", textAlign: "center", margin: "16px 0" }}>
          <hr style={{ border: "none", borderTop: "1px solid var(--ink-200)" }} />
          <span style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "white", padding: "0 10px", fontSize: 12, color: "var(--ink-400)" }}>
            hoặc đăng nhập thủ công
          </span>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email hoặc Tên đăng nhập</label>
            <input
              placeholder="admin@movix.vn hoặc email của bạn..."
              value={form.identity}
              onChange={(e) => setForm({ ...form, identity: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu (mặc định: 123)..."
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12, padding: "8px 12px", background: "#fef2f2", color: "#b91c1c", borderRadius: 6, fontSize: 13 }}>{error}</div>}
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <button
              type="button"
              style={{ fontSize: 13, color: "var(--brand-600)", fontWeight: 600 }}
              onClick={() => go("forgotPassword")}
            >
              Quên mật khẩu?
            </button>
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Đăng nhập
          </button>
        </form>

        <div className="form-foot">
          Chưa có tài khoản? <button onClick={() => go("register")}>Đăng ký ngay</button>
        </div>
      </div>
    </div>
  );
}
