import { createContext, useContext, useState, useCallback } from "react"

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  const addToWishlist = useCallback(movie => {
    setWishlist(prev => {
      if (prev.some(m => m.id === movie.id)) return prev
      return [...prev, movie]
    })
  }, [])

  const removeFromWishlist = useCallback(movieId => {
    // setWishlist(prev => prev.filter(m => m.id !== movieId))
      setWishlist(prev=>prev.filter(m=>m.id!==movieId))
  }, [])

  const toggleWishlist = useCallback(movie => {
    setWishlist(prev =>
      prev.some(m => m.id === movie.id)
        ? prev.filter(m => m.id !== movie.id)
        : [...prev, movie]
    )
  }, [])

  const isWishlisted = useCallback(
    movieId => wishlist.some(m => m.id === movieId),
    [wishlist]
  )

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}
    >
      
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider")
  return ctx
}
