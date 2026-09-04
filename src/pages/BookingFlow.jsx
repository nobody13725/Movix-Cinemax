import React, { useMemo, useState } from "react";
import { movies, cinemas, buildSeatMap, TICKET_PRICE, VIP_PRICE, combos } from "../data/mockData.js";
import Stepper from "../components/Stepper.jsx";

function formatVnd(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function BookingFlow({ go, params, user }) {
  const movie = movies.find((m) => m.id === params?.movieId) || movies[0];
  const cinema = cinemas.find((c) => c.id === params?.cinemaId) || cinemas[0];
  const time = params?.time || "20:15";

  const [step, setStep] = useState("seats");
  const [seatMap] = useState(buildSeatMap);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [comboQty, setComboQty] = useState({});

  const seatIndex = useMemo(() => {
    const idx = {};
    seatMap.forEach((r) => r.seats.forEach((s) => (idx[s.id] = s)));
    return idx;
  }, [seatMap]);

  function toggleSeat(seat) {
    if (seat.taken) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id) ? prev.filter((s) => s !== seat.id) : [...prev, seat.id]
    );
  }

  const seatTotal = selectedSeats.reduce((sum, id) => {
    const s = seatIndex[id];
    return sum + (s.vip ? VIP_PRICE : TICKET_PRICE);
  }, 0);

  const comboTotal = Object.entries(comboQty).reduce((sum, [id, qty]) => {
    const c = combos.find((c) => c.id === id);
    return sum + (c ? c.price * qty : 0);
  }, 0);

  const grandTotal = seatTotal + comboTotal;

  function changeQty(id, delta) {
    setComboQty((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  }

  function goNext() {
    if (step === "seats") {
      if (selectedSeats.length === 0) return;
      setStep("combo");
    } else if (step === "combo") {
      setStep("payment");
    } else {
      if (!user) {
        go("login", { redirect: "profile" });
        return;
      }
      go("bookingSuccess", {
        movieId: movie.id,
        seats: selectedSeats,
        total: grandTotal,
        cinema: cinema.name,
        time,
      });
    }
  }

  function goBack() {
    if (step === "combo") setStep("seats");
    else if (step === "payment") setStep("combo");
    else go("movie", { id: movie.id });
  }

  return (
    <section className="section container">
      <div className="breadcrumb">
        <button onClick={() => go("home")}>Trang chủ</button>
        <span className="sep">/</span>
        <button onClick={() => go("movie", { id: movie.id })}>{movie.title}</button>
        <span className="sep">/</span>
        <span>Đặt vé</span>
      </div>

      <div className="card" style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div className="detail-poster" style={{ width: 56, height: 78, background: movie.color, fontSize: 26 }}>{movie.emoji}</div>
          <div>
            <h3 style={{ fontSize: 16 }}>{movie.title}</h3>
            <p className="movie-meta">{movie.ageTag} · {movie.duration} phút · {movie.genre}</p>
          </div>
        </div>
        <Stepper current={step} />
      </div>

      <div className="seat-map-wrap">
        <div className="card">
          {step === "seats" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Chọn ghế ngồi</h3>
              <div className="screen-label">MÀN HÌNH</div>
              <div className="screen-bar" />
              {seatMap.map((r) => (
                <div className="seat-row" key={r.row}>
                  <div className="row-label">{r.row}</div>
                  <div className="seat-group">
                    {r.seats.slice(0, 6).map((s) => (
                      <SeatButton key={s.id} seat={s} selected={selectedSeats.includes(s.id)} onClick={() => toggleSeat(s)} />
                    ))}
                  </div>
                  <div className="seat-aisle" />
                  <div className="seat-group">
                    {r.seats.slice(6).map((s) => (
                      <SeatButton key={s.id} seat={s} selected={selectedSeats.includes(s.id)} onClick={() => toggleSeat(s)} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="legend">
                <div className="legend-item"><span className="legend-swatch" style={{ background: "white", border: "1px solid var(--ink-100)" }} />Trống</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--brand-500)" }} />Đã chọn</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--ink-300)" }} />Đã bán</div>
                <div className="legend-item"><span className="legend-swatch" style={{ background: "var(--amber-100)", border: "1px solid #f2d9a3" }} />VIP</div>
              </div>
            </>
          )}

          {step === "combo" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Chọn bắp nước (không bắt buộc)</h3>
              <div className="combo-list">
                {combos.map((c) => (
                  <div className="combo-row" key={c.id}>
                    <div className="combo-icon">{c.emoji}</div>
                    <div className="combo-info">
                      <div className="name">{c.name}</div>
                      <div className="desc">{c.desc}</div>
                    </div>
                    <div className="combo-price">{formatVnd(c.price)}</div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => changeQty(c.id, -1)}>−</button>
                      <div className="qty-val">{comboQty[c.id] || 0}</div>
                      <button className="qty-btn" onClick={() => changeQty(c.id, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === "payment" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Phương thức thanh toán</h3>
              <PaymentOptions />
            </>
          )}
        </div>

        <div className="card summary-card">
          <h3>Thông tin đặt vé</h3>
          <div className="summary-row"><span>Phim</span><span style={{ color: "var(--ink-900)", fontWeight: 600, textAlign: "right" }}>{movie.title}</span></div>
          <div className="summary-row"><span>Rạp</span><span style={{ color: "var(--ink-900)", fontWeight: 600, textAlign: "right" }}>{cinema.name}</span></div>
          <div className="summary-row"><span>Suất chiếu</span><span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{time}</span></div>

          <div className="summary-divider" />
          <div className="summary-row"><span>Ghế đã chọn</span></div>
          {selectedSeats.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--ink-300)", fontStyle: "italic" }}>Chưa chọn ghế nào</p>
          ) : (
            <div className="chip-list">
              {selectedSeats.map((s) => <span className="chip" key={s}>{s}</span>)}
            </div>
          )}

          {step !== "seats" && (
            <>
              <div className="summary-divider" />
              <div className="summary-row"><span>Số lượng vé</span><span>{selectedSeats.length} vé</span></div>
              <div className="summary-row"><span>Tiền vé</span><span>{formatVnd(seatTotal)}</span></div>
              {comboTotal > 0 && <div className="summary-row"><span>Bắp nước</span><span>{formatVnd(comboTotal)}</span></div>}
            </>
          )}

          <div className="summary-row total"><span>Tổng cộng</span><span>{formatVnd(grandTotal)}</span></div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary btn-block" disabled={step === "seats" && selectedSeats.length === 0} onClick={goNext}>
              {step === "seats" ? "Tiếp tục đặt bắp nước" : step === "combo" ? "Tiếp tục thanh toán" : "Xác nhận thanh toán"}
            </button>
            <button className="btn btn-secondary btn-block" onClick={goBack}>Quay lại</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SeatButton({ seat, selected, onClick }) {
  const cls = ["seat"];
  if (seat.vip) cls.push("vip");
  if (selected) cls.push("selected");
  if (seat.taken) cls.push("taken");
  return (
    <button className={cls.join(" ")} onClick={onClick} disabled={seat.taken} aria-label={`Ghế ${seat.id}`}>
      {seat.id.slice(1)}
    </button>
  );
}

function PaymentOptions() {
  const [method, setMethod] = useState("card");
  const options = [
    { key: "card", label: "Thẻ tín dụng / ghi nợ", emoji: "💳" },
    { key: "momo", label: "Ví MoMo", emoji: "🅜" },
    { key: "banking", label: "Chuyển khoản ngân hàng", emoji: "🏦" },
  ];
  return (
    <div className="combo-list">
      {options.map((o) => (
        <div
          key={o.key}
          className="combo-row"
          style={{ cursor: "pointer", borderColor: method === o.key ? "var(--brand-500)" : "var(--ink-100)" }}
          onClick={() => setMethod(o.key)}
        >
          <div className="combo-icon">{o.emoji}</div>
          <div className="combo-info">
            <div className="name">{o.label}</div>
          </div>
          <div className={`seat ${method === o.key ? "selected" : ""}`} style={{ borderRadius: "50%" }}>
            {method === o.key ? "✓" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
