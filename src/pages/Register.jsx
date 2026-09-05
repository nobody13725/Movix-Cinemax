import React, { useState } from "react";
import { dbService } from "../lib/supabaseClient.js";

export default function Register({ go, goBack, onLogin }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [error, setError] = useState("");

  function submitForm(e) {
    e.preventDefault();
    if (!form.fullName.trim()) return setError("Vui lòng nhập họ và tên");
    if (!form.email.trim() || !form.email.includes("@")) return setError("Email không hợp lệ");
    if (form.password.length < 6) return setError("Mật khẩu cần tối thiểu 6 ký tự");
    if (form.password !== form.confirm) return setError("Mật khẩu xác nhận không khớp");

    // Kiểm tra email đã được đăng ký chưa
    const existing = dbService.getUserByIdentity(form.email.trim());
    if (existing) {
      return setError("Email này đã được đăng ký tài khoản. Vui lòng chọn Đăng nhập hoặc sử dụng email khác.");
    }

    setError("");
    setStage(2);
  }

  function submitOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Vui lòng nhập đủ 6 số OTP");

    const newUser = dbService.addUser({
      fullName: form.fullName.trim(),
      username: form.username || form.email.split("@")[0],
      email: form.email.trim(),
      phone: form.phone || "0912345678",
      password: form.password,
      role: "customer",
      tier: "Thành viên",
      point: 50,
      status: "Hoạt động",
    });

    onLogin(newUser);
    go("home");
  }

  function updateOtp(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      if (el) el.focus();
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
          <h2>{stage === 1 ? "Tạo tài khoản Movix" : "Xác minh email"}</h2>
          <p>{stage === 1 ? "Đăng ký để tích điểm thành viên và nhận ưu đãi độc quyền" : `Nhập mã OTP đã gửi tới ${form.email}`}</p>
        </div>

        <div className="auth-steps">
          <div className="step-circle" style={{ background: "var(--brand-500)", borderColor: "var(--brand-500)", color: "white" }}>
            1
          </div>
          <div className="step-line" style={{ background: stage >= 2 ? "var(--brand-500)" : "var(--ink-100)" }} />
          <div
            className="step-circle"
            style={{
              background: stage >= 2 ? "var(--brand-500)" : "white",
              borderColor: stage >= 2 ? "var(--brand-500)" : "var(--ink-100)",
              color: stage >= 2 ? "white" : "var(--ink-300)",
            }}
          >
            2
          </div>
        </div>

        {stage === 1 ? (
          <form onSubmit={submitForm}>
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="vd: Nguyễn Văn A"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912..."
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">
              Tiếp tục xác nhận OTP
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp}>
            <div className="otp-inputs">
              {otp.map((v, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={v}
                  maxLength={1}
                  onChange={(e) => updateOtp(i, e.target.value)}
                />
              ))}
            </div>
            {error && <div className="form-error" style={{ textAlign: "center" }}>{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">
              Xác nhận và Hoàn tất
            </button>
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setStage(1)}
                style={{ color: "var(--ink-600)", fontSize: 13 }}
              >
                ← Quay lại chỉnh sửa thông tin
              </button>
            </div>
          </form>
        )}

        {stage === 1 && (
          <div className="form-foot">
            Đã có tài khoản? <button onClick={() => go("login")}>Đăng nhập</button>
          </div>
        )}
      </div>
    </div>
  );
}
