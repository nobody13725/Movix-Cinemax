import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import { FALLBACK_POSTER, FALLBACK_CINEMA, handleImageError } from "../utils/imageFallback";

function buildDateStrip() {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const out = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const dow = i === 0 ? "Hôm nay" : days[d.getDay()];
    const dm = `${d.getDate()}/${d.getMonth() + 1}`;
    out.push({ key, dow, dm });
  }
  return out;
}

export default function Showtimes({ go, params }) {
  const dates = buildDateStrip();
  const [activeDate, setActiveDate] = useState(dates[0].key);
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [cities, setCities] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cityId, setCityId] = useState("");
  const [movieId, setMovieId] = useState(params?.movieId || "");
  const [cinemaId, setCinemaId] = useState(params?.cinemaId || "");

  const loadData = () => {
    setFilms(dbService.getFilms());
    setCinemas(dbService.getCinemas());
    setCities(dbService.getCities());
    setShowtimes(dbService.getShowtimes());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const filteredCinemas = cinemas.filter((c) => {
    if (cityId && c.cityId !== cityId) return false;
    if (cinemaId && c.id !== cinemaId) return false;
    return true;
  });

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <h2>Lịch chiếu phim Movix</h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 2 }}>
            Xem suất chiếu khả dụng và đặt chỗ trực tuyến theo ngày
          </p>
        </div>
      </div>

      {params?.promoCode && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))",
            border: "1px dashed var(--brand-500)",
            borderRadius: 10,
            padding: "10px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🏷️</span>
            <span style={{ fontSize: 13.5, color: "var(--ink-800)" }}>
              Ưu đãi kèm theo: <strong style={{ color: "var(--brand-700)" }}>{params.promoCode}</strong> (Sẽ tự động áp dụng khi thanh toán)
            </span>
          </div>
          <button
            onClick={() => go("promotions")}
            style={{ background: "none", border: "none", color: "var(--brand-600)", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            Đổi mã khác →
          </button>
        </div>
      )}

      {/* Date Strip */}
      <div className="date-strip" style={{ marginBottom: 20 }}>
        {dates.map((d) => (
          <button
            key={d.key}
            className={`date-chip ${activeDate === d.key ? "active" : ""}`}
            onClick={() => setActiveDate(d.key)}
          >
            <div className="dow">{d.dow}</div>
            <div>{d.dm}</div>
          </button>
        ))}
      </div>

      {/* Quick Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <select
          className="input-control"
          style={{ width: "auto", minWidth: 180 }}
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            setCinemaId("");
          }}
        >
          <option value="">Tất cả khu vực</option>
          {cities.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>

        <select
          className="input-control"
          style={{ width: "auto", minWidth: 200 }}
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        >
          <option value="">Tất cả phim</option>
          {films.map((f) => (
            <option key={f.id} value={f.id}>
              {f.title}
            </option>
          ))}
        </select>

        <select
          className="input-control"
          style={{ width: "auto", minWidth: 200 }}
          value={cinemaId}
          onChange={(e) => setCinemaId(e.target.value)}
        >
          <option value="">Tất cả rạp chiếu</option>
          {cinemas
            .filter((c) => !cityId || c.cityId === cityId)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        {(cityId || movieId || cinemaId) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCityId("");
              setMovieId("");
              setCinemaId("");
            }}
          >
            ↺ Xóa lọc
          </button>
        )}
      </div>

      {(() => {
        const cinemaWithShowtimes = filteredCinemas.filter((c) =>
          showtimes.some(
            (st) =>
              st.cinemaId === c.id &&
              (!movieId || st.filmId === movieId) &&
              (!st.date || st.date === activeDate)
          )
        );

        if (cinemaWithShowtimes.length === 0) {
          return (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--ink-500)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
              <h3 style={{ color: "var(--ink-800)", marginBottom: 8 }}>Chưa có suất chiếu phù hợp</h3>
              <p style={{ maxWidth: 480, margin: "0 auto 16px", fontSize: 14 }}>
                Không tìm thấy suất chiếu nào vào ngày đã chọn với tiêu chí lọc hiện tại. Bạn có thể chọn ngày khác hoặc xóa bộ lọc để xem các suất chiếu khả dụng.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setCityId("");
                  setMovieId("");
                  setCinemaId("");
                  setActiveDate(dates[0].key);
                }}
              >
                ↺ Xem lịch chiếu hôm nay
              </button>
            </div>
          );
        }

        return cinemaWithShowtimes.map((c) => {
          // Lấy tất cả showtimes tại rạp này theo ngày đã chọn
          const cinemaShowtimes = showtimes.filter((st) => {
            if (st.cinemaId !== c.id) return false;
            if (movieId && st.filmId !== movieId) return false;
            if (st.date && st.date !== activeDate) return false;
            return true;
          });

          // Group by film
          const grouped = {};
        cinemaShowtimes.forEach((st) => {
          if (!grouped[st.filmId]) grouped[st.filmId] = [];
          grouped[st.filmId].push(st);
        });

        return (
          <div className="card cinema-block" key={c.id} style={{ marginBottom: 20 }}>
            <div className="head">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {c.avatar && (c.avatar.startsWith("http") || c.avatar.startsWith("data:image")) ? (
                  <img
                    src={c.avatar}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_CINEMA)}
                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--brand-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {c.avatar || "🏢"}
                  </div>
                )}
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{c.name}</h3>
                  <p className="addr" style={{ margin: "2px 0 0" }}>{c.address}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="status-open">Đang mở cửa</div>
                <div className="movie-meta" style={{ fontSize: 12 }}>Rạp tiêu chuẩn cao cấp</div>
              </div>
            </div>

            {Object.entries(grouped).map(([fId, stList]) => {
              const film = films.find((f) => f.id === fId);
              if (!film) return null;

              return (
                <div className="showtime-row" key={fId} style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260, flex: "0 1 auto" }}>
                    {(film.posterUrl || film.thumbnail) && ((film.posterUrl || film.thumbnail).startsWith("http") || (film.posterUrl || film.thumbnail).startsWith("data:image")) ? (
                      <img
                        src={film.posterUrl || film.thumbnail}
                        alt={film.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                        style={{
                          width: 44,
                          height: 60,
                          borderRadius: 6,
                          objectFit: "cover",
                          flexShrink: 0,
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        }}
                        onClick={() => go("movie", { id: fId })}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 60,
                          borderRadius: 6,
                          background: "var(--brand-50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                        onClick={() => go("movie", { id: fId })}
                      >
                        🎬
                      </div>
                    )}
                    <div>
                      <div
                        className="film-title"
                        style={{ cursor: "pointer", fontWeight: 700, fontSize: 15 }}
                        onClick={() => go("movie", { id: fId })}
                      >
                        {film.title}
                      </div>
                      <div className="film-meta" style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="badge badge-amber" style={{ fontSize: 10, padding: "1px 6px" }}>
                          {film.ageRating || "P"}
                        </span>
                        <span>{film.duration} phút</span>
                        <span>·</span>
                        <span>{film.format || "2D"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="time-pills" style={{ flex: 1 }}>
                    {stList.map((st) => (
                      <button
                        key={st.id}
                        className="time-pill"
                        title={`Giá vé: ${(st.basePrice || 75000).toLocaleString("vi-VN")}đ | Đã đặt: ${
                          st.seatsBooked?.length || 0
                        } ghế`}
                        onClick={() =>
                          go("seatSelect", {
                            movieId: film.id,
                            cinemaId: c.id,
                            showtimeId: st.id,
                            time: st.startTime,
                            date: activeDate,
                            promoCode: params?.promoCode,
                          })
                        }
                      >
                        {st.startTime}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
        });
      })()}
    </section>
  );
}
