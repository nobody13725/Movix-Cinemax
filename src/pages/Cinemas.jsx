import React from "react";
import { cinemas } from "../data/mockData.js";

export default function Cinemas({ go }) {
  return (
    <section className="section container">
      <div className="section-head"><h2>Hệ thống rạp</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {cinemas.map((c) => (
          <div className="card" key={c.id}>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>{c.name}</h3>
            <p className="movie-meta" style={{ marginBottom: 10 }}>{c.address}</p>
            <p className="status-open" style={{ marginBottom: 16 }}>Đang mở cửa · {c.openHours}</p>
            <button className="btn btn-secondary btn-block" onClick={() => go("showtimes", { cinemaId: c.id })}>
              Xem lịch chiếu
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
