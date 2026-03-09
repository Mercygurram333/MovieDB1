import { BrowserRouter, Routes, Route } from "react-router-dom"
import { WishlistProvider } from "./context/WishlistContext"
import Login from "./components/Login"
import Home from "./components/Home"
import MovieDetails from "./components/MovieDetails"
import Wishlist from "./components/Wishlist"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  )
}

export default App
