import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import { useWishlist } from "../context/WishlistContext"

const API_TOKEN = process.env.REACT_APP_TMDB_TOKEN

function Home() {
  const [movies, setMovies] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const navigate = useNavigate()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/week",
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        )
        setMovies(res.data.results)
      } catch (err) {
        setError("Failed to load movies. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSearch = async () => {
    if (!search.trim()) return
    try {
      setLoading(true)
      setError("")
      setSearched(true)
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      )
      setMovies(res.data.results)
    } catch (err) {
      setError("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSearch("")
    setSearched(false)
  }

  const handleWishlist = (e, movie) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(movie)
  }

  return (
    <div className="page-wrapper">
      <Header />

      <div className="container">
        <div className="home-hero">
          <h1>🎬 Discover Movies</h1>
          <p>Browse trending films or search for your favourites</p>
        </div>

        <div className="search-bar">
          <input
            placeholder="Search for a movie..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          {searched && (
            <button className="clear-btn" onClick={handleClear}>✕</button>
          )}
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>

        {error && <div className="error-text">{error}</div>}

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : (
          <>
            <div className="section-title">
              {searched ? `Results for "${search}"` : "Trending This Week"}
            </div>

            {movies.length === 0 ? (
              <div className="status-message">
                <div className="status-icon">🎭</div>
                <p>No movies found. Try a different search.</p>
              </div>
            ) : (
              <div className="movie-grid">
                {movies.map(movie => {
                  const wishlisted = isWishlisted(movie.id)
                  return (
                    <div
                      key={movie.id}
                      className="movie-card"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <img
                        className="movie-card-img"
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "https://via.placeholder.com/300x450/1a1a28/606078?text=No+Poster"
                        }
                        alt={movie.title}
                        loading="lazy"
                      />

                      <button
                        className={`wishlist-btn${wishlisted ? " wishlisted" : ""}`}
                        onClick={e => handleWishlist(e, movie)}
                        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {wishlisted ? "♥" : "♡"}
                      </button>
                      

                      <div className="movie-card-overlay">
                        <div className="movie-card-title">{movie.title}</div>
                        <div className="movie-card-rating">
                          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
