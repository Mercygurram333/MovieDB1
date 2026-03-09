const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const users = [
  { id: 1, username: "admin", password: "admin123" }
]

app.post("/login", (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." })
  }

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." })
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  })

  res.json({ token, message: "Login successful." })
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Access token required." })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." })
    req.user = user
    next()
  })
}

app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` })
})

app.listen(5001, () => console.log("Server running on port 5001"))
