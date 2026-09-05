import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import MovieCard from "../components/MovieCard.jsx";
import { FALLBACK_POSTER, FALLBACK_CINEMA, handleImageError } from "../utils/imageFallback";

export default function Home({ go }) {
  const [films, setFilms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedFilm, setSelectedFilm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");
  const [showtimeCityFilter, setShowtimeCityFilter] = useState("");

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayDisplay = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  const loadData = () => {
    setFilms(dbService.getFilms());
    setCinemas(dbService.getCinemas());
    setShowtimes(dbService.getShowtimes());
    setCities(dbService.getCities());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  function findShowtimes(e) {
    e.preventDefault();
    go("showtimes", {
      movieId: selectedFilm || undefined,
      cinemaId: selectedCinema || undefined,
    });
  }

  const filteredCinemas = cinemas.filter((c) => {
    if (selectedCity && c.cityId !== selectedCity) return false;
    return true;
  });

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">Hệ thống đặt vé xem phim Movix</p>
          <h1>Chọn phim, chọn ghế, giữ chỗ chỉ trong 2 phút</h1>
          <p className="sub">
            Cập nhật lịch chiếu mới nhất từ các rạp trên toàn quốc với kết nối Supabase CSDL thời gian thực.
          </p>

          <form className="search-card" onSubmit={findShowtimes}>
            <div className="field">
              <label>Chọn phim</label>
              <select value={selectedFilm} onChange={(e) => setSelectedFilm(e.target.value)}>
                <option value="">Tất cả phim</option>
                {films.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Chọn thành phố</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">Toàn quốc</option>
                {cities.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Chọn rạp</label>
              <select value={selectedCinema} onChange={(e) => setSelectedCinema(e.target.value)}>
                <option value="">Tất cả rạp</option>
                {filteredCinemas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" type="submit">
              Tìm suất chiếu
            </button>
          </form>
        </div>
      </section>

      {/* Phim đang chiếu (UC01, UC03) */}
      <section className="section container">
        <div className="section-head">
          <div>
            <h2>Phim đang chiếu ({films.filter((f) => f.status === "Đang chiếu").length})</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 2 }}>
              Những tác phẩm bom tấn điện ảnh hấp dẫn nhất tháng này
            </p>
          </div>
          <button className="link-more" onClick={() => go("movies")}>
            Xem tất cả phim →
          </button>
        </div>

        <div className="movie-grid">
          {films.slice(0, 8).map((f) => (
            <MovieCard key={f.id} movie={f} go={go} />
          ))}
        </div>
      </section>

      {/* Lịch chiếu theo cụm rạp (UC05) */}
      <section className="section container">
        <div className="section-head" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2>Lịch chiếu hôm nay</h2>
              <span className="badge badge-purple" style={{ fontSize: 12, padding: "2px 8px" }}>
                {todayDisplay}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 2 }}>
              Các suất chiếu khả dụng tại các cụm rạp đối tác trên toàn quốc
            </p>
          </div>
          <button className="link-more" onClick={() => go("showtimes")}>
            Xem toàn bộ lịch chiếu tuần →
          </button>
        </div>

        {/* Bộ lọc nhanh theo thành phố */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            className={`btn btn-sm ${!showtimeCityFilter ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setShowtimeCityFilter("")}
          >
            Tất cả khu vực
          </button>
          {cities.map((ct) => (
            <button
              key={ct.id}
              className={`btn btn-sm ${showtimeCityFilter === ct.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setShowtimeCityFilter(ct.id)}
            >
              {ct.name}
            </button>
          ))}
        </div>

        {(() => {
          const visibleCinemas = cinemas.filter((c) => {
            if (showtimeCityFilter && c.cityId !== showtimeCityFilter) return false;
            return true;
          });

          // Lọc danh sách rạp có suất chiếu hôm nay
          let renderedCount = 0;

          const renderedList = visibleCinemas.map((c) => {
            // Lấy các suất chiếu của rạp này (ưu tiên ngày hôm nay hoặc tất cả nếu chưa có)
            const cinemaShowtimes = showtimes.filter((st) => {
              if (st.cinemaId !== c.id) return false;
              if (st.date && st.date !== todayDateStr) return false;
              return true;
            });

            // Nếu không có suất chiếu hôm nay, hiển thị các suất chiếu có sẵn của rạp
            const effectiveShowtimes = cinemaShowtimes.length > 0
              ? cinemaShowtimes
              : showtimes.filter((st) => st.cinemaId === c.id);

            if (effectiveShowtimes.length === 0) return null;

            // Gom nhóm theo phim
            const filmGroups = {};
            effectiveShowtimes.forEach((st) => {
              if (!filmGroups[st.filmId]) filmGroups[st.filmId] = [];
              filmGroups[st.filmId].push(st);
            });

            renderedCount++;

            return (
              <div className="card cinema-block" key={c.id} style={{ marginBottom: 18 }}>
                <div className="head">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {c.avatar && (c.avatar.startsWith("http") || c.avatar.startsWith("data:image")) ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_CINEMA)}
                        style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: "var(--brand-50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {c.avatar || "🏢"}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: 16, margin: 0 }}>{c.name}</h3>
                      <p className="addr" style={{ margin: "2px 0 0" }}>{c.address}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="status-open">Đang mở cửa</div>
                    <div className="movie-meta" style={{ fontSize: 12 }}>Tiêu chuẩn quốc tế</div>
                  </div>
                </div>

                {Object.entries(filmGroups).map(([fId, stList]) => {
                  const f = films.find((film) => film.id === fId);
                  if (!f) return null;
                  return (
                    <div className="showtime-row" key={fId} style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260, flex: "0 1 auto" }}>
                        {(f.posterUrl || f.thumbnail) && ((f.posterUrl || f.thumbnail).startsWith("http") || (f.posterUrl || f.thumbnail).startsWith("data:image")) ? (
                          <img
                            src={f.posterUrl || f.thumbnail}
                            alt={f.title}
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
                            onClick={() => go("movie", { id: f.id })}
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
                            onClick={() => go("movie", { id: f.id })}
                          >
                            🎬
                          </div>
                        )}
                        <div>
                          <div
                            className="film-title"
                            style={{ cursor: "pointer", fontWeight: 700, fontSize: 15 }}
                            onClick={() => go("movie", { id: f.id })}
                          >
                            {f.title}
                          </div>
                          <div className="film-meta" style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            <span className="badge badge-amber" style={{ fontSize: 10, padding: "1px 6px" }}>
                              {f.ageRating || "P"}
                            </span>
                            <span>{f.duration} phút</span>
                            <span>·</span>
                            <span>{f.format || "2D"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="time-pills" style={{ flex: 1 }}>
                        {stList.map((st) => (
                          <button
                            key={st.id}
                            className="time-pill"
                            title={`Giá vé: ${(st.basePrice || 75000).toLocaleString("vi-VN")}đ | Phòng: ${st.roomId || "Standard"}`}
                            onClick={() =>
                              go("seatSelect", {
                                movieId: f.id,
                                cinemaId: c.id,
                                showtimeId: st.id,
                                time: st.startTime,
                                date: st.date || todayDateStr,
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

          if (renderedCount === 0) {
            return (
              <div className="card" style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-500)" }}>
                <div style={{ fontSize: 42, marginBottom: 10 }}>🎬</div>
                <h4 style={{ color: "var(--ink-800)", marginBottom: 6 }}>Chưa có suất chiếu hôm nay tại khu vực này</h4>
                <p style={{ fontSize: 13.5, marginBottom: 14 }}>
                  Vui lòng chọn khu vực khác hoặc xem toàn bộ lịch chiếu tuần của Movix.
                </p>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowtimeCityFilter("")}>
                  Xem tất cả khu vực
                </button>
              </div>
            );
          }

          return renderedList;
        })()}
      </section>
    </>
  );
}
