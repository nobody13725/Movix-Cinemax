import React, { useState } from "react";

export default function Login({ go, onLogin, params }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!form.identity.trim()) return setError("Vui lòng nhập email hoặc số điện thoại");
    if (!form.password) return setError("Vui lòng nhập mật khẩu");
    setError("");
    onLogin({ name: form.identity.includes("@") ? form.identity.split("@")[0] : "Thành viên", identity: form.identity });
    go(params?.redirect || "home");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-mark">🎬</div>
          <h2>Movix</h2>
          <p>Phim gì cũng có, đặt vé liền ngay</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email hoặc số điện thoại</label>
            <input
              placeholder="you@email.com"
              value={form.identity}
              onChange={(e) => setForm({ ...form, identity: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <button type="button" style={{ fontSize: 13, color: "var(--brand-600)", fontWeight: 600 }} onClick={() => go("forgotPassword")}>
              Quên mật khẩu?
            </button>
          </div>
          <button className="btn btn-primary btn-block" type="submit">Đăng nhập</button>
        </form>

        <div className="form-foot">
          Chưa có tài khoản? <button onClick={() => go("register")}>Đăng ký ngay</button>
        </div>
      </div>
    </div>
  );
}
