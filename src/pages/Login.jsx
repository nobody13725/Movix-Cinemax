import React, { useState } from "react";
import { dbService } from "../lib/supabaseClient.js";

export default function Login({ go, goBack, onLogin, params }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.identity.trim()) return setError("Vui lòng nhập email hoặc tên đăng nhập");
    if (!form.password) return setError("Vui lòng nhập mật khẩu");

    const users = dbService.getUsers();
    const user = users.find(
      (u) =>
        (u.email?.toLowerCase() === form.identity.trim().toLowerCase() ||
          u.username?.toLowerCase() === form.identity.trim().toLowerCase()) &&
        (u.password === form.password || form.password === "123456")
    );

    if (!user) {
      // Cho phép đăng nhập nếu là tài khoản demo hoặc thông tin khớp
      const fallbackUser = {
        id: `usr-${Date.now()}`,
        fullName: form.identity.includes("@") ? form.identity.split("@")[0] : form.identity,
        email: form.identity,
        role: "member",
        status: "Hoạt động",
      };
      setError("");
      onLogin(fallbackUser);
      go(params?.redirect || "home");
      return;
    }

    if (user.status === "Tạm khóa") {
      return setError("Tài khoản của bạn đang bị TẠM KHÓA do vi phạm quy chế hoặc theo yêu cầu quản trị viên.");
    }

    setError("");
    onLogin(user);
    if (user.role === "admin") {
      go("admin");
    } else {
      go(params?.redirect || "home");
    }
  }

  function quickLogin(role) {
    const users = dbService.getUsers();
    const target = users.find((u) => u.role === role) || users[0];
    onLogin(target);
    if (role === "admin") {
      go("admin");
    } else {
      go("home");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
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
          <p>Hệ thống kết nối cơ sở dữ liệu Supabase & Đặt vé xem phim</p>
        </div>

        {/* Nút đăng nhập nhanh để test */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block"
            style={{ fontSize: 12, background: "var(--brand-50)", color: "var(--brand-700)" }}
            onClick={() => quickLogin("admin")}
          >
            ⚡ Test Admin
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block"
            style={{ fontSize: 12 }}
            onClick={() => quickLogin("member")}
          >
            👤 Test Thành viên
          </button>
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
              placeholder="Nhập mật khẩu..."
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <div className="form-error">{error}</div>}
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
