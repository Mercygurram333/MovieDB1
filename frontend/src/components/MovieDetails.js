import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "./Header"

const API_TOKEN = process.env.REACT_APP_TMDB_TOKEN

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        )
        setMovie(res.data)
      } catch (err) {
        console.error("Error fetching movie details", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="container">
          <div className="status-message">
            <div className="status-icon">😕</div>
            <p>Movie not found.</p>
          </div>
        </div>
      </div>
    )
  }

  const ratingColor =
    movie.vote_average >= 7
      ? "#4caf50"
      : movie.vote_average >= 5
      ? "#f5c518"
      : "#e50914"

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "N/A"

  return (
    <div className="movie-details-page">
      <Header />

      {movie.backdrop_path && (
        <div className="movie-backdrop">
          <img
            className="movie-backdrop-img"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
          />
          <div className="movie-backdrop-gradient" />
        </div>
      )}

      <div className="movie-details-content">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="movie-details-layout fade-in-up">
          <div className="movie-details-poster">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                  : "https://via.placeholder.com/400x600/1a1a28/606078?text=No+Poster"
              }
              alt={movie.title}
            />
          </div>

          <div className="movie-details-info">
            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-details-genres">
                {movie.genres.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            )}

            <h1 className="movie-details-title">{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-details-tagline">"{movie.tagline}"</p>
            )}

            <div className="meta-rating">
              <span className="star">⭐</span>
              <span className="score" style={{ color: ratingColor }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="score-max">/10</span>
              {movie.vote_count && (
                <span className="vote-count">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              )}
            </div>

            <div className="movie-details-meta">
              {movie.release_date && (
                <div className="meta-item">
                  <span className="meta-label">Release Date</span>
                  <span className="meta-value">
                    {new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
              )}

              <div className="meta-item">
                <span className="meta-label">Runtime</span>
                <span className="meta-value">{runtime}</span>
              </div>

              {movie.original_language && (
                <div className="meta-item">
                  <span className="meta-label">Language</span>
                  <span className="meta-value">
                    {movie.original_language.toUpperCase()}
                  </span>
                </div>
              )}

              {movie.status && (
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value">{movie.status}</span>
                </div>
              )}
            </div>

            {movie.overview && (
              <div>
                <p className="overview-title">Overview</p>
                <p className="overview-text">{movie.overview}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
