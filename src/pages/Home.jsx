import React, { useState } from "react";
import { movies, cinemas, genres } from "../data/mockData.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Home({ go }) {
  const [film, setFilm] = useState("");
  const [city, setCity] = useState("");
  const [cinema, setCinema] = useState("");

  function findShowtimes(e) {
    e.preventDefault();
    go("showtimes", { movieId: film || undefined, cinemaId: cinema || undefined });
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">Đặt vé xem phim</p>
          <h1>Chọn phim, chọn ghế, giữ chỗ chỉ trong 2 phút</h1>
          <p className="sub">Cập nhật lịch chiếu mới nhất từ các rạp trên toàn quốc. Nhanh chóng, tiện lợi, an toàn.</p>

          <form className="search-card" onSubmit={findShowtimes}>
            <div className="field">
              <label>Chọn phim</label>
              <select value={film} onChange={(e) => setFilm(e.target.value)}>
                <option value="">Tất cả phim</option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Chọn thành phố</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Toàn quốc</option>
                <option value="hn">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
              </select>
            </div>
            <div className="field">
              <label>Chọn rạp</label>
              <select value={cinema} onChange={(e) => setCinema(e.target.value)}>
                <option value="">Tất cả rạp</option>
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Tìm suất chiếu</button>
          </form>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Phim đang chiếu</h2>
          <button className="link-more" onClick={() => go("movies")}>Xem tất cả →</button>
        </div>
        <div className="movie-grid">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} go={go} />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Lịch chiếu hôm nay</h2>
          <button className="link-more" onClick={() => go("showtimes")}>Xem tất cả →</button>
        </div>
        {cinemas.map((c) => (
          <div className="card cinema-block" key={c.id}>
            <div className="head">
              <div>
                <h3>{c.name}</h3>
                <p className="addr">{c.address}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="status-open">Đang mở cửa</div>
                <div className="movie-meta">Đóng cửa {c.openHours.split(" - ")[1]}</div>
              </div>
            </div>
            {Object.entries(c.showtimes).slice(0, 2).map(([movieId, times]) => {
              const movie = movies.find((m) => m.id === movieId);
              if (!movie) return null;
              return (
                <div className="showtime-row" key={movieId}>
                  <div className="film-title">{movie.title}</div>
                  <div className="film-meta">{movie.ageTag} · {movie.duration} phút</div>
                  <div className="time-pills">
                    {times.map((t) => (
                      <button
                        key={t}
                        className="time-pill"
                        onClick={() => go("seatSelect", { movieId, cinemaId: c.id, time: t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="section container" style={{ paddingBottom: 8 }}>
        <div className="section-head">
          <h2>Thể loại nổi bật</h2>
        </div>
        <div className="chip-list" style={{ gap: 10 }}>
          {genres.map((g) => (
            <button key={g} className="chip" style={{ padding: "8px 16px", fontSize: 13 }} onClick={() => go("movies", { genre: g })}>
              {g}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
