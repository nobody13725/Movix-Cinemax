import React, { useMemo, useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import Stepper from "../components/Stepper.jsx";
import { FALLBACK_POSTER, FALLBACK_COMBO, handleImageError } from "../utils/imageFallback";

function formatVnd(n) {
  return (n || 0).toLocaleString("vi-VN") + "đ";
}

export default function BookingFlow({ go, goBack: appGoBack, params, user }) {
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [comboFoods, setComboFoods] = useState([]);

  // Load backend data
  const loadData = () => {
    setFilms(dbService.getFilms());
    setCinemas(dbService.getCinemas());
    setRooms(dbService.getRooms());
    setShowtimes(dbService.getShowtimes());
    setComboFoods(dbService.getComboFoods());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const movie = films.find((m) => m.id === params?.movieId) || films[0] || {};
  const cinema = cinemas.find((c) => c.id === params?.cinemaId) || cinemas[0] || {};
  const showtime =
    showtimes.find((st) => st.id === params?.showtimeId) ||
    showtimes.find((st) => st.filmId === movie.id && st.cinemaId === cinema.id) ||
    showtimes[0] ||
    {};
  const room = rooms.find((r) => r.id === showtime?.roomId) || rooms[0] || {};

  const time = params?.time || showtime?.startTime || "19:30";
  const date = params?.date || showtime?.date || new Date().toISOString().slice(0, 10);
  const basePrice = showtime?.basePrice || 80000;
  const vipPrice = basePrice + 15000;

  // Booking states
  const [step, setStep] = useState("seats"); // seats -> combo -> payment
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [comboQty, setComboQty] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Build seat layout from room config or default
  const seatLayout = useMemo(() => {
    const layout = room?.seatLayout || [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12, vip: true },
      { row: "G", count: 12, vip: true },
    ];

    const bookedList = showtime?.seatsBooked || ["D05", "D06", "E07"];

    return layout.map((r) => {
      const seats = [];
      for (let i = 1; i <= (r.count || 12); i++) {
        const id = `${r.row}${i < 10 ? "0" + i : i}`;
        seats.push({
          id,
          row: r.row,
          num: i,
          vip: !!r.vip,
          taken: bookedList.includes(id),
        });
      }
      return { row: r.row, seats };
    });
  }, [room, showtime]);

  const seatIndex = useMemo(() => {
    const idx = {};
    seatLayout.forEach((r) => r.seats.forEach((s) => (idx[s.id] = s)));
    return idx;
  }, [seatLayout]);

  function toggleSeat(seat) {
    if (seat.taken) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id) ? prev.filter((s) => s !== seat.id) : [...prev, seat.id]
    );
  }

  const seatTotal = selectedSeats.reduce((sum, id) => {
    const s = seatIndex[id];
    return sum + (s?.vip ? vipPrice : basePrice);
  }, 0);

  const comboTotal = Object.entries(comboQty).reduce((sum, [id, qty]) => {
    const c = comboFoods.find((item) => item.id === id);
    return sum + (c ? c.price * qty : 0);
  }, 0);

  const subtotal = seatTotal + comboTotal;

  // Xử lý mã khuyến mãi
  const discountAmount = appliedPromo
    ? Math.min((subtotal * appliedPromo.discountPercent) / 100, appliedPromo.maxDiscount || Infinity)
    : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount);

  function handleApplyPromo(e) {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const res = dbService.validatePromo(promoCode, subtotal);
    if (res.valid) {
      setAppliedPromo(res.promo);
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError(res.message);
    }
  }

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
      // Hoàn tất đặt vé (UC08, UC09) -> Lưu vào Supabase Database!
      const comboSummary = Object.entries(comboQty)
        .filter(([, q]) => q > 0)
        .map(([id, quantity]) => {
          const c = comboFoods.find((item) => item.id === id);
          return {
            id,
            name: c?.name || "Bắp nước",
            quantity,
            price: c?.price || 0,
          };
        });

      const seatDetails = selectedSeats.map((sId) => ({
        seatKey: sId,
        type: seatIndex[sId]?.vip ? "VIP" : "Standard",
        price: seatIndex[sId]?.vip ? vipPrice : basePrice,
      }));

      const newOrder = dbService.createOrder({
        userId: user?.id || `guest-${Date.now()}`,
        userName: user?.fullName || user?.name || "Khách hàng",
        phone: user?.phone || "0988776655",
        filmId: movie.id,
        filmTitle: movie.title,
        cinemaId: cinema.id,
        cinemaName: cinema.name,
        roomId: room.id,
        roomName: room.name || "Phòng 1",
        showtimeId: showtime?.id,
        showtimeTime: time,
        showtimeDate: date,
        seats: seatDetails,
        comboFoods: comboSummary,
        seatAmount: seatTotal,
        comboAmount: comboTotal,
        promotionCode: appliedPromo?.code || null,
        discountAmount: discountAmount,
        totalAmount: grandTotal,
        paymentMethod:
          paymentMethod === "card"
            ? "Thẻ Visa/Mastercard"
            : paymentMethod === "momo"
            ? "Ví điện tử MoMo"
            : "Chuyển khoản VietQR",
      });

      go("bookingSuccess", {
        orderId: newOrder.id,
        ticketCode: newOrder.ticketCode,
        ticketQrUrl: newOrder.ticketQrUrl,
        movieId: movie.id,
        movieTitle: movie.title,
        cinema: cinema.name,
        room: room.name,
        time,
        date,
        seats: selectedSeats,
        total: grandTotal,
      });
    }
  }

  function goBack() {
    if (step === "combo") {
      setStep("seats");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (step === "payment") {
      setStep("combo");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (typeof appGoBack === "function") {
        appGoBack();
      } else if (movie?.id) {
        go("movie", { id: movie.id });
      } else {
        go("home");
      }
    }
  }

  return (
    <section className="section container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={goBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
        >
          ← {step === "seats" ? "Quay lại trang trước" : step === "combo" ? "Quay lại chọn ghế" : "Quay lại chọn bắp nước"}
        </button>
        <div className="breadcrumb" style={{ margin: 0 }}>
          <button onClick={() => go("home")}>Trang chủ</button>
          <span className="sep">/</span>
          {movie?.id && (
            <>
              <button onClick={() => go("movie", { id: movie.id })}>{movie.title}</button>
              <span className="sep">/</span>
            </>
          )}
          <span>Đặt vé</span>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            className="detail-poster"
            style={{
              width: 56,
              height: 78,
              background: "var(--brand-50)",
              fontSize: 28,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {movie.thumbnail || "🎬"}
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>{movie.title}</h3>
            <p className="movie-meta">
              {movie.ageRating || "P"} · {movie.duration} phút · {cinema.name} ({room.name})
            </p>
          </div>
        </div>
        <Stepper current={step} />
      </div>

      <div className="seat-map-wrap">
        <div className="card">
          {/* Bước 1: Chọn ghế ngồi (UC06, Hình 11) */}
          {step === "seats" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Chọn ghế ngồi ({room.name || "Phòng chiếu"})</h3>
              <div className="screen-label">MÀN HÌNH CHIẾU</div>
              <div className="screen-bar" />

              <div style={{ overflowX: "auto", paddingBottom: 10 }}>
                {seatLayout.map((r) => (
                  <div className="seat-row" key={r.row}>
                    <div className="row-label">{r.row}</div>
                    <div className="seat-group">
                      {r.seats.slice(0, 6).map((s) => (
                        <SeatButton
                          key={s.id}
                          seat={s}
                          selected={selectedSeats.includes(s.id)}
                          onClick={() => toggleSeat(s)}
                        />
                      ))}
                    </div>
                    <div className="seat-aisle" />
                    <div className="seat-group">
                      {r.seats.slice(6).map((s) => (
                        <SeatButton
                          key={s.id}
                          seat={s}
                          selected={selectedSeats.includes(s.id)}
                          onClick={() => toggleSeat(s)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="legend">
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: "white", border: "1px solid var(--ink-100)" }} />
                  Ghế thường ({formatVnd(basePrice)})
                </div>
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: "var(--amber-100)", border: "1px solid #f2d9a3" }} />
                  Ghế VIP ({formatVnd(vipPrice)})
                </div>
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: "var(--brand-500)" }} />
                  Đang chọn
                </div>
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: "var(--ink-300)" }} />
                  Đã bán / Đang giữ
                </div>
              </div>
            </>
          )}

          {/* Bước 2: Chọn bắp nước (UC07, Hình 12) */}
          {step === "combo" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Chọn bắp nước & combo ưu đãi (UC07)</h3>
              <div className="combo-list">
                {comboFoods.map((c) => (
                  <div className="combo-row" key={c.id}>
                    <div
                      className="combo-icon"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--brand-50)",
                        flexShrink: 0,
                      }}
                    >
                      {c.image && (c.image.startsWith("http") || c.image.startsWith("data:image")) ? (
                        <img src={c.image} alt={c.name} referrerPolicy="no-referrer" onError={(e) => handleImageError(e, FALLBACK_COMBO)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 32 }}>{c.image || "🍿"}</span>
                      )}
                    </div>
                    <div className="combo-info">
                      <div className="name" style={{ fontWeight: 700 }}>{c.name}</div>
                      <div className="desc">{c.description}</div>
                    </div>
                    <div className="combo-price">{formatVnd(c.price)}</div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => changeQty(c.id, -1)}>
                        −
                      </button>
                      <div className="qty-val">{comboQty[c.id] || 0}</div>
                      <button className="qty-btn" onClick={() => changeQty(c.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bước 3: Thanh toán (UC08, Hình 13) */}
          {step === "payment" && (
            <>
              <h3 style={{ marginBottom: 18 }}>Phương thức thanh toán an toàn</h3>
              <PaymentOptions method={paymentMethod} setMethod={setPaymentMethod} />

              {/* Mã giảm giá khuyến mãi (UC18) */}
              <div style={{ marginTop: 24, padding: 16, background: "var(--ink-50)", borderRadius: 10 }}>
                <h4 style={{ fontSize: 14, marginBottom: 8 }}>🏷️ Mã giảm giá khuyến mãi Movix</h4>
                <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Nhập mã (vd: MOVIX50, CHAOMOI, VIP20)..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ textTransform: "uppercase" }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Áp dụng
                  </button>
                </form>

                {appliedPromo && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--green-500)", fontWeight: 600 }}>
                    ✓ Đã áp dụng mã {appliedPromo.code}: Giảm {appliedPromo.discountPercent}% (-{formatVnd(discountAmount)})
                  </div>
                )}
                {promoError && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "var(--red-500)" }}>
                    ✕ {promoError}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar tóm tắt đơn hàng */}
        <div className="card summary-card">
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
            {(movie.posterUrl || movie.thumbnail) && (movie.posterUrl || movie.thumbnail).startsWith("http") ? (
              <img
                src={movie.posterUrl || movie.thumbnail}
                alt=""
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                style={{ width: 46, height: 66, objectFit: "cover", borderRadius: 6, flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
              />
            ) : null}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 16, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {movie.title}
              </h3>
              <div style={{ fontSize: 12, color: "var(--brand-600)", fontWeight: 600, marginTop: 3 }}>
                {movie.format || "2D, 3D"} · {movie.ageRating || "P"} · {movie.duration || 120}p
              </div>
            </div>
          </div>
          <div className="summary-row">
            <span>Rạp</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600, textAlign: "right" }}>
              {cinema.name}
            </span>
          </div>
          <div className="summary-row">
            <span>Phòng chiếu</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{room.name || "Phòng 1"}</span>
          </div>
          <div className="summary-row">
            <span>Suất chiếu</span>
            <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>
              {time} ({date})
            </span>
          </div>

          <div className="summary-divider" />
          <div className="summary-row">
            <span>Ghế đã chọn ({selectedSeats.length})</span>
          </div>
          {selectedSeats.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--ink-300)", fontStyle: "italic" }}>
              Chưa chọn ghế nào
            </p>
          ) : (
            <div className="chip-list">
              {selectedSeats.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {step !== "seats" && (
            <>
              <div className="summary-divider" />
              <div className="summary-row">
                <span>Tiền vé</span>
                <span>{formatVnd(seatTotal)}</span>
              </div>
              {comboTotal > 0 && (
                <div className="summary-row">
                  <span>Bắp nước</span>
                  <span>{formatVnd(comboTotal)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="summary-row" style={{ color: "var(--green-500)" }}>
                  <span>Giảm giá khuyến mãi</span>
                  <span>-{formatVnd(discountAmount)}</span>
                </div>
              )}
            </>
          )}

          <div className="summary-row total">
            <span>Tổng cộng</span>
            <span style={{ color: "var(--brand-600)" }}>{formatVnd(grandTotal)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <button
              className="btn btn-primary btn-block"
              disabled={step === "seats" && selectedSeats.length === 0}
              onClick={goNext}
            >
              {step === "seats"
                ? "Tiếp tục chọn bắp nước →"
                : step === "combo"
                ? "Tiếp tục thanh toán →"
                : "Xác nhận thanh toán ngay"}
            </button>
            <button type="button" className="btn btn-secondary btn-block" onClick={goBack}>
              ← {step === "seats" ? "Quay lại trang trước" : step === "combo" ? "Quay lại chọn ghế" : "Quay lại chọn bắp nước"}
            </button>
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
    <button
      className={cls.join(" ")}
      onClick={onClick}
      disabled={seat.taken}
      title={seat.taken ? "Ghế đã có người đặt" : `Ghế ${seat.id} (${seat.vip ? "VIP" : "Thường"})`}
    >
      {seat.num < 10 ? `0${seat.num}` : seat.num}
    </button>
  );
}

function PaymentOptions({ method, setMethod }) {
  const options = [
    { key: "card", label: "Thẻ Visa / Mastercard / JCB", emoji: "💳" },
    { key: "momo", label: "Ví điện tử MoMo", emoji: "🅜" },
    { key: "banking", label: "Quét mã chuyển khoản VietQR 24/7", emoji: "🏦" },
  ];
  return (
    <div className="combo-list">
      {options.map((o) => (
        <div
          key={o.key}
          className="combo-row"
          style={{
            cursor: "pointer",
            borderColor: method === o.key ? "var(--brand-500)" : "var(--ink-100)",
            background: method === o.key ? "var(--brand-50)" : "white",
          }}
          onClick={() => setMethod(o.key)}
        >
          <div className="combo-icon" style={{ fontSize: 24 }}>{o.emoji}</div>
          <div className="combo-info">
            <div className="name" style={{ fontWeight: 600 }}>{o.label}</div>
          </div>
          <div
            className={`seat ${method === o.key ? "selected" : ""}`}
            style={{ borderRadius: "50%", width: 26, height: 26 }}
          >
            {method === o.key ? "✓" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
