import React, { useState, useEffect } from "react";
import { dbService, subscribeDb } from "../lib/supabaseClient.js";
import { FALLBACK_CINEMA, handleImageError } from "../utils/imageFallback";

export default function Cinemas({ go }) {
  const [cinemas, setCinemas] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("all");

  const loadData = () => {
    setCinemas(dbService.getCinemas());
    setCities(dbService.getCities());
  };

  useEffect(() => {
    loadData();
    return subscribeDb(loadData);
  }, []);

  const filtered = cinemas.filter(
    (c) => selectedCity === "all" || c.cityId === selectedCity
  );

  return (
    <section className="section container">
      <div className="section-head">
        <div>
          <h2>Hệ thống rạp chiếu Movix</h2>
          <p style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 2 }}>
            Các cụm rạp tiêu chuẩn quốc tế trang bị công nghệ âm thanh Dolby Atmos & máy chiếu Laser hiện đại
          </p>
        </div>
      </div>

      {/* City tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          className={`chip ${selectedCity === "all" ? "active" : ""}`}
          style={{
            background: selectedCity === "all" ? "var(--brand-500)" : "var(--ink-50)",
            color: selectedCity === "all" ? "white" : "var(--ink-700)",
            padding: "8px 16px",
            fontWeight: 600,
          }}
          onClick={() => setSelectedCity("all")}
        >
          Tất cả khu vực ({cinemas.length})
        </button>
        {cities.map((ct) => (
          <button
            key={ct.id}
            className={`chip ${selectedCity === ct.id ? "active" : ""}`}
            style={{
              background: selectedCity === ct.id ? "var(--brand-500)" : "var(--ink-50)",
              color: selectedCity === ct.id ? "white" : "var(--ink-700)",
              padding: "8px 16px",
              fontWeight: 600,
            }}
            onClick={() => setSelectedCity(ct.id)}
          >
            {ct.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {filtered.map((c) => {
          const isRealImg = c.avatar && (c.avatar.startsWith("http") || c.avatar.startsWith("data:image"));
          const bannerImg = c.banner || (isRealImg ? c.avatar : null);

          return (
            <div className="card" key={c.id} style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {bannerImg ? (
                <div style={{ height: 140, position: "relative", overflow: "hidden", background: "var(--ink-100)" }}>
                  <img
                    src={bannerImg}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, FALLBACK_CINEMA)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(20,21,43,0.7) 0%, transparent 60%)",
                    }}
                  />
                  <span
                    className="badge badge-purple"
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 16,
                      background: "rgba(255,255,255,0.95)",
                      color: "var(--brand-700)",
                      fontWeight: 700,
                    }}
                  >
                    {cities.find((ct) => ct.id === c.cityId)?.name || "Việt Nam"}
                  </span>
                </div>
              ) : null}

              <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "var(--brand-50)",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {isRealImg ? (
                      <img src={c.avatar} alt="" referrerPolicy="no-referrer" onError={(e) => handleImageError(e, FALLBACK_CINEMA)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      c.avatar || "🏢"
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, lineHeight: 1.3 }}>{c.name}</h3>
                    {!bannerImg && (
                      <span className="badge badge-purple" style={{ marginTop: 4, display: "inline-block" }}>
                        {cities.find((ct) => ct.id === c.cityId)?.name || "Việt Nam"}
                      </span>
                    )}
                  </div>
                </div>

                <p className="movie-meta" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                  📍 {c.address}
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 16, flex: 1 }}>
                  {c.description || "Phòng chiếu đạt chuẩn ISO với màn chiếu bạc độ sáng cao."}
                </p>

                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => go("showtimes", { cinemaId: c.id })}
                >
                  📅 Xem lịch chiếu tại rạp này
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
