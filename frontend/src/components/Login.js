import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        "http://localhost:5001/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      )
      localStorage.setItem("token", res.data.token)
      navigate("/")
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
          "Invalid username or password. Please try again."
        )
      } else if (err.request) {
        setError("Cannot connect to server. Make sure the backend is running on port 5001.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card fade-in-up">
        <div className="login-brand">
          <span className="login-brand-icon">🎬</span>
          <span className="login-brand-text">
            <span className="brand-name">Movie</span>
            <span className="brand-accent">DB</span>
          </span>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your movie dashboard</p>

        {error && (
          <div className="error-text">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-hint">
          Use <strong>admin</strong> / <strong>admin123</strong> to sign in
        </p>
      </div>
    </div>
  )
}

export default Login
