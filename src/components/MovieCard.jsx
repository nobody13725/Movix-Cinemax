import React from "react";

export default function MovieCard({ movie, go }) {
  return (
    <div className="movie-card" onClick={() => go("movie", { id: movie.id })}>
      <div className="poster" style={{ background: movie.color }}>
        <span className="badge">{movie.ageTag}</span>
        <span>{movie.emoji}</span>
        <span className="rating">⭐ {movie.rating}</span>
      </div>
      <div className="movie-title">{movie.title}</div>
      <div className="movie-meta">{movie.genre} · {movie.duration} phút</div>
    </div>
  );
}
