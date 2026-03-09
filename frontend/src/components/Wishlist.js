import { Link } from "react-router-dom"
import Header from "./Header"
import { useWishlist } from "../context/WishlistContext"

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()

  return (
    <div className="page-wrapper">
      <Header />

      <div className="container">
        <div className="home-hero">
          <h1>♥ My Wishlist</h1>
          <p>
            {wishlist.length > 0
              ? `${wishlist.length} movie${wishlist.length > 1 ? "s" : ""} saved`
              : "Movies you save will appear here"}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Browse movies and click the heart icon to save them here.</p>
            <Link to="/" className="btn-primary wishlist-browse-btn">
              Browse Movies
            </Link>
          </div>
        ) : (
          <>
            <div className="section-title">Saved Movies</div>
            <div className="wishlist-grid">
              {wishlist.map(movie => (
                <div key={movie.id} className="wishlist-card fade-in-up">
                  <Link to={`/movie/${movie.id}`} className="wishlist-card-link">
                    <img
                      className="wishlist-card-img"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "https://via.placeholder.com/300x450/1a1a28/606078?text=No+Poster"
                      }
                      alt={movie.title}
                      loading="lazy"
                    />
                  </Link>

                  <div className="wishlist-card-info">
                    <Link to={`/movie/${movie.id}`} className="wishlist-card-title">
                      {movie.title}
                    </Link>

                    <div className="wishlist-card-meta">
                      <span className="wishlist-card-rating">
                        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                      </span>
                      {movie.release_date && (
                        <span className="wishlist-card-year">
                          {movie.release_date.slice(0, 4)}
                        </span>
                      )}
                    </div>

                    {movie.overview && (
                      <p className="wishlist-card-overview">
                        {movie.overview.length > 120
                          ? movie.overview.slice(0, 120) + "…"
                          : movie.overview}
                      </p>
                    )}

                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(movie.id)}
                      aria-label={`Remove ${movie.title} from wishlist`}
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Wishlist
