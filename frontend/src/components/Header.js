import { Link, useNavigate, useLocation } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { wishlist } = useWishlist()
  const count = wishlist.length

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <span className="brand-icon">🎬</span>
        <span>
          <span className="brand-name">Movie</span>
          <span className="brand-accent">DB</span>
        </span>
      </Link>

      <nav className="header-nav">
        <Link
          to="/"
          className={`nav-link${location.pathname === "/" ? " nav-link-active" : ""}`}
        >
          Home
        </Link>

        <Link
          to="/wishlist"
          className={`nav-link wishlist-nav${location.pathname === "/wishlist" ? " nav-link-active" : ""}`}
          aria-label={`Wishlist (${count} movies)`}
        >
          <span className="wishlist-icon">♥</span>
          <span>Wishlist</span>
          {count > 0 && (
            <span className="wishlist-badge">{count}</span>
          )}
        </Link>

        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  )
}

export default Header
