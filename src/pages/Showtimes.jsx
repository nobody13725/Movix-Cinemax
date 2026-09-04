import React, { useState } from "react";
import { movies, cinemas, buildDateStrip } from "../data/mockData.js";

export default function Showtimes({ go, params }) {
  const dates = buildDateStrip();
  const [activeDate, setActiveDate] = useState(dates[0].key);
  const [movieId] = useState(params?.movieId || "");
  const filteredCinemas = params?.cinemaId
    ? cinemas.filter((c) => c.id === params.cinemaId)
    : cinemas;

  return (
    <section className="section container">
      <div className="section-head">
        <h2>Lịch chiếu phim</h2>
      </div>

      <div className="date-strip" style={{ marginBottom: 24 }}>
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

      {filteredCinemas.map((c) => {
        const entries = Object.entries(c.showtimes).filter(
          ([mId]) => !movieId || mId === movieId
        );
        if (entries.length === 0) return null;
        return (
          <div className="card cinema-block" key={c.id}>
            <div className="head">
              <div>
                <h3>{c.name}</h3>
                <p className="addr">{c.address}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="status-open">Đang mở cửa</div>
                <div className="movie-meta">{c.openHours}</div>
              </div>
            </div>
            {entries.map(([mId, times]) => {
              const movie = movies.find((m) => m.id === mId);
              if (!movie) return null;
              return (
                <div className="showtime-row" key={mId}>
                  <div className="film-title" style={{ cursor: "pointer" }} onClick={() => go("movie", { id: mId })}>
                    {movie.title}
                  </div>
                  <div className="film-meta">{movie.ageTag} · {movie.duration} phút · {movie.genre}</div>
                  <div className="time-pills">
                    {times.map((t) => (
                      <button
                        key={t}
                        className="time-pill"
                        onClick={() => go("seatSelect", { movieId: mId, cinemaId: c.id, time: t, date: activeDate })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
