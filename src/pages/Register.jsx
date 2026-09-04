import React, { useState } from "react";

export default function Register({ go, onLogin }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  function submitForm(e) {
    e.preventDefault();
    if (!form.username.trim()) return setError("Vui lòng nhập tên đăng nhập");
    if (!form.email.trim() || !form.email.includes("@")) return setError("Email không hợp lệ");
    if (form.password.length < 6) return setError("Mật khẩu cần tối thiểu 6 ký tự");
    if (form.password !== form.confirm) return setError("Mật khẩu xác nhận không khớp");
    setError("");
    setStage(2);
  }

  function submitOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Vui lòng nhập đủ 6 số OTP");
    setError("");
    onLogin({ name: form.username, identity: form.email });
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
        <div className="auth-logo">
          <div className="brand-mark">🎬</div>
          <h2>{stage === 1 ? "Tạo tài khoản Movix" : "Xác minh email"}</h2>
          <p>{stage === 1 ? "Đăng ký để đặt vé và tích điểm thành viên" : `Nhập mã OTP đã gửi tới ${form.email}`}</p>
        </div>

        <div className="auth-steps">
          <div className={`step-circle ${stage >= 1 ? "" : ""}`} style={{ background: "var(--brand-500)", borderColor: "var(--brand-500)", color: "white" }}>1</div>
          <div className="step-line" style={{ background: stage >= 2 ? "var(--brand-500)" : "var(--ink-100)" }} />
          <div className="step-circle" style={{ background: stage >= 2 ? "var(--brand-500)" : "white", borderColor: stage >= 2 ? "var(--brand-500)" : "var(--ink-100)", color: stage >= 2 ? "white" : "var(--ink-300)" }}>2</div>
        </div>

        {stage === 1 ? (
          <form onSubmit={submitForm}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="vd. minhanh99" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Nhập lại mật khẩu" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">Gửi mã OTP</button>
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
            <button className="btn btn-primary btn-block" type="submit">Xác nhận</button>
            <div className="form-foot">
              Không nhận được mã? <button type="button" onClick={() => setError("")}>Gửi lại</button>
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
