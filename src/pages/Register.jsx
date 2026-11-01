import React, { useState, useRef } from "react";
import { dbService } from "../lib/supabaseClient.js";

export default function Register({ go, goBack, onLogin }) {
  const [stage, setStage] = useState(1);
  const [form, setForm] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  function findDuplicate(email, phone) {
    const users = dbService.getUsers() || [];
    if (users.some((u) => u.email?.trim().toLowerCase() === email.toLowerCase())) return "email";
    if (phone && users.some((u) => u.phone === phone)) return "phone";
    return null;
  }

  function submitForm(e) {
    e.preventDefault();
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    // TC_REG_01: bỏ trống toàn bộ
    if (!fullName && !email && !form.password && !form.confirm) {
      return setError("Vui lòng nhập đầy đủ các trường bắt buộc");
    }

    // Họ tên (TC_REG_08, 16, 17, 18, 20)
    if (!fullName) return setError("Vui lòng nhập họ và tên");
    if (fullName.length > 100) return setError("Họ tên vượt quá độ dài cho phép (tối đa 100 ký tự)");
    if (!/^[\p{L}]+(?:[\s'.-][\p{L}]+)*$/u.test(fullName)) {
      return setError("Họ tên không hợp lệ (chỉ gồm chữ cái và khoảng trắng)");
    }

    // Email (TC_REG_05, 06, 07, 09)
    if (!email) return setError("Vui lòng nhập email");
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Email không hợp lệ");
    }

    // Số điện thoại (TC_REG_21, 22, 23)
    if (phone && !/^0\d{9}$/.test(phone)) return setError("Số điện thoại không hợp lệ");

    // Mật khẩu (TC_REG_10, 11, 12, 13, 14, 15)
    if (!form.password) return setError("Vui lòng nhập mật khẩu");
    if (form.password.length < 8) return setError("Mật khẩu cần tối thiểu 8 ký tự");
    if (form.password.length > 128) return setError("Mật khẩu vượt quá độ dài cho phép (tối đa 128 ký tự)");
    if (
      !/[a-z]/.test(form.password) ||
      !/[A-Z]/.test(form.password) ||
      !/\d/.test(form.password) ||
      !/[^A-Za-z0-9]/.test(form.password)
    ) {
      return setError("Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
    }
    if (!form.confirm) return setError("Vui lòng nhập xác nhận mật khẩu");
    if (form.password !== form.confirm) return setError("Mật khẩu xác nhận không khớp");

    // Email / SĐT đã tồn tại (TC_REG_03, 04, 24) - không phân biệt hoa thường
    const dup = findDuplicate(email, phone);
    if (dup === "email") {
      return setError("Email đã tồn tại. Vui lòng chọn Đăng nhập hoặc sử dụng email khác.");
    }
    if (dup === "phone") return setError("Số điện thoại đã tồn tại");

    setError("");
    setStage(2);
  }

  function submitOtp(e) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Vui lòng nhập đủ 6 số OTP");

    // TC_REG_27: bấm 2 lần liên tiếp không tạo tài khoản trùng
    if (submittingRef.current) return;
    if (findDuplicate(form.email.trim(), form.phone.trim())) {
      return setError("Email hoặc số điện thoại đã tồn tại");
    }
    submittingRef.current = true;

    const newUser = dbService.addUser({
      fullName: form.fullName.trim(),
      username: form.username || form.email.trim().split("@")[0],
      email: form.email.trim(),
      phone: form.phone.trim(),
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
          <form onSubmit={submitForm} noValidate>
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