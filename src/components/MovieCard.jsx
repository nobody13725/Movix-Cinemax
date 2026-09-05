import React, { useState } from "react";
import { FALLBACK_POSTER } from "../utils/imageFallback";

export default function MovieCard({ movie, go }) {
  const [imgSrc, setImgSrc] = useState(movie.posterUrl || movie.thumbnail || FALLBACK_POSTER);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImgError = () => {
    if (imgSrc !== FALLBACK_POSTER) {
      setImgSrc(FALLBACK_POSTER);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="movie-card" onClick={() => go("movie", { id: movie.id })}>
      <div
        className="poster"
        style={{
          background: movie.color || "linear-gradient(135deg, var(--brand-700), var(--purple-700))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={movie.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImgError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              inset: 0,
              transition: "transform 0.3s ease",
            }}
            className="poster-img"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
              textAlign: "center",
              background: "linear-gradient(135deg, #1e1b4b, #312e81)",
            }}
          >
            <span style={{ fontSize: 36, marginBottom: 6 }}>🎬</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{movie.title}</span>
          </div>
        )}

        <span
          className="badge"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(20, 21, 43, 0.8)",
          }}
        >
          {movie.ageRating || movie.ageTag || "P"}
        </span>

        <span
          className="rating"
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            zIndex: 2,
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            fontWeight: 700,
            fontSize: 12,
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          ⭐ {movie.rating || 8.0}
        </span>
      </div>

      <div className="movie-title" title={movie.title}>
        {movie.title}
      </div>
      <div className="movie-meta">
        {movie.format || "2D, 3D"} · {movie.duration || 120} phút
      </div>
    </div>
  );
}
