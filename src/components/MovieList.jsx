import React, { useEffect, useState } from "react";
import MovieItem from "./MovieItem.jsx";

export default function MovieList() {
  const [movieList, setMovieList] = useState([]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const comedyGenreId = 35;
  const itemsPerPage = 4;
  const movieIds = React.useRef(new Set());

  const fetchMovies = async (searchTerm, page = 1) => {
    try {
      const url =
        searchTerm.length > 1
          ? `https://api.themoviedb.org/3/search/movie?api_key=${
              import.meta.env.PUBLIC_API_KEY
            }&query=${searchTerm}&with_genres=${comedyGenreId}&page=${page}`
          : `https://api.themoviedb.org/3/discover/movie?api_key=${
              import.meta.env.PUBLIC_API_KEY
            }&with_genres=${comedyGenreId}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      const filteredMovies = data.results.filter((movie) => {
        if (movieIds.current.has(movie.id)) {
          return false;
        } else {
          movieIds.current.add(movie.id);
          return movie.genre_ids.includes(comedyGenreId); // Filter for comedy
        }
      });
      setMovieList((prevMovies) => [...prevMovies, ...filteredMovies]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = async (e) => {
    const newInput = e.target.value;
    setInput(newInput);
    if (newInput.length > 1) {
      setPage(1); // Reset page to 1
      setMovieList([]); // Clear previous list
      movieIds.current.clear();
      await fetchMovies(newInput);
    }
  };

  useEffect(() => {
    if (!input) {
      fetchMovies("", page);
    } else if (input.length > 1) {
      handleInputChange({ target: { value: input } });
    }
  }, [page, input]);

  const scrollMovieList = async (direction) => {
    const scrollContainer = document.querySelector(".movie-list");
    const movieItemWidth =
      scrollContainer.querySelector(".movie-item").offsetWidth;
    const scrollAmount = movieItemWidth * itemsPerPage;

    if (direction === "left") {
      scrollContainer.scrollLeft -= scrollAmount;
    } else if (direction === "right") {
      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (scrollContainer.scrollLeft + scrollAmount >= maxScrollLeft) {
        await fetchMovies(input, page + 1);
        setPage((prevPage) => prevPage + 1);
      }
      scrollContainer.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="container">
      <form className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder="Search for a movie"
          onChange={handleInputChange}
        />
      </form>
      <h1>{input ? "Search Results" : "Popular Comedy Movies"}</h1>{" "}
      <div className="scroll-container">
        <button
          onClick={() => scrollMovieList("left")}
          className="scroll-button left"
          style={{ display: movieList.length < 4 ? "none" : "" }}
        >
          &#10094;
        </button>
        <div className="movie-list">
          {movieList.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))}
        </div>
        <button
          onClick={() => scrollMovieList("right")}
          className="scroll-button right"
          style={{ display: movieList.length < 4 ? "none" : "" }}
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
