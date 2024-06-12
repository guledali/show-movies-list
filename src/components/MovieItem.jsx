import React from "react";

export default function MovieItem({ movie }) {
  return (
    <div className="movie-item">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} Poster`}
      />
      <h2>{movie.title}</h2>
      <div className="genres">Comedy</div>
      <div className="rating">
        <i className="fas fa-star"></i>
        {movie.vote_average}
      </div>
    </div>
  );
}
