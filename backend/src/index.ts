import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RIMSS API',
    version: '0.1.0',
  })
})

// Placeholder for auth routes
app.get('/api/auth/me', (_req, res) => {
  res.status(401).json({ error: 'Not authenticated' })
})

// Start server
app.listen(PORT, () => {
  console.log(`
  ============================================
  RIMSS Backend Server
  ============================================
  Server running on: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  ============================================
  `)
})

export default app
