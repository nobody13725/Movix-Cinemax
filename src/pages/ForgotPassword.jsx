import React, { useState } from "react";

const STEPS = ["Xác thực", "Mã OTP", "Mật khẩu mới"];

export default function ForgotPassword({ go }) {
  const [stage, setStage] = useState(1);
  const [identity, setIdentity] = useState("");
  const [otp, setOtp] = useState("");
  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [error, setError] = useState("");

  function step1(e) {
    e.preventDefault();
    if (!identity.trim()) return setError("Vui lòng nhập email hoặc số điện thoại");
    setError("");
    setStage(2);
  }
  function step2(e) {
    e.preventDefault();
    if (otp.length < 6) return setError("Mã xác thực gồm 6 số");
    setError("");
    setStage(3);
  }
  function step3(e) {
    e.preventDefault();
    if (pwd.next.length < 6) return setError("Mật khẩu cần tối thiểu 6 ký tự");
    if (pwd.next !== pwd.confirm) return setError("Mật khẩu xác nhận không khớp");
    go("login");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="brand-mark">🎬</div>
          <h2>Movix</h2>
          <p>Phim gì cũng có, đặt vé liền ngay</p>
        </div>

        <div className="auth-steps">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: "center" }}>
                <div className="step-circle" style={{
                  background: stage >= i + 1 ? "var(--brand-500)" : "white",
                  borderColor: stage >= i + 1 ? "var(--brand-500)" : "var(--ink-100)",
                  color: stage >= i + 1 ? "white" : "var(--ink-300)",
                }}>{i + 1}</div>
              </div>
              {i < STEPS.length - 1 && <div className="step-line" style={{ background: stage > i + 1 ? "var(--brand-500)" : "var(--ink-100)" }} />}
            </React.Fragment>
          ))}
        </div>

        <h3 style={{ textAlign: "center", marginBottom: 4, fontSize: 17 }}>Quên mật khẩu?</h3>
        <p style={{ textAlign: "center", color: "var(--ink-500)", fontSize: 13.5, marginBottom: 20 }}>
          {stage === 1 && "Nhập email hoặc số điện thoại để nhận mã xác thực"}
          {stage === 2 && `Nhập mã xác thực đã gửi tới ${identity}`}
          {stage === 3 && "Đặt mật khẩu mới cho tài khoản của bạn"}
        </p>

        {stage === 1 && (
          <form onSubmit={step1}>
            <div className="form-group">
              <label>Email hoặc số điện thoại</label>
              <input value={identity} onChange={(e) => setIdentity(e.target.value)} placeholder="Nhập email hoặc số điện thoại" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">Gửi mã xác thực</button>
          </form>
        )}
        {stage === 2 && (
          <form onSubmit={step2}>
            <div className="form-group">
              <label>Mã xác thực</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="Nhập mã 6 số" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">Xác nhận</button>
          </form>
        )}
        {stage === 3 && (
          <form onSubmit={step3}>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} placeholder="Nhập lại mật khẩu mới" />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit">Đặt lại mật khẩu</button>
          </form>
        )}

        <div className="form-foot">
          <button onClick={() => go("login")}>← Quay lại đăng nhập</button>
        </div>
      </div>
    </div>
  );
}
