import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    // Allow localhost on common development ports
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177',
    ]

    // Also allow FRONTEND_URL from env if set
    const frontendUrl = process.env.FRONTEND_URL
    if (frontendUrl && !allowedOrigins.includes(frontendUrl)) {
      allowedOrigins.push(frontendUrl)
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
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

// Mock user data for testing
const mockUsers = [
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@example.mil',
    first_name: 'John',
    last_name: 'Admin',
    role: 'ADMIN',
    programs: [
      { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System', is_default: true },
      { pgm_id: 2, pgm_cd: 'ACTS', pgm_name: 'Advanced Targeting Capability System', is_default: false },
      { pgm_id: 3, pgm_cd: 'ARDS', pgm_name: 'Airborne Reconnaissance Data System', is_default: false },
      { pgm_id: 4, pgm_cd: '236', pgm_name: 'Program 236', is_default: false },
    ],
  },
  {
    user_id: 2,
    username: 'depot_mgr',
    email: 'depot@example.mil',
    first_name: 'Jane',
    last_name: 'Depot',
    role: 'DEPOT_MANAGER',
    programs: [
      { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System', is_default: true },
    ],
  },
  {
    user_id: 3,
    username: 'field_tech',
    email: 'field@example.mil',
    first_name: 'Bob',
    last_name: 'Field',
    role: 'FIELD_TECHNICIAN',
    programs: [
      { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System', is_default: true },
    ],
  },
  {
    user_id: 4,
    username: 'viewer',
    email: 'viewer@example.mil',
    first_name: 'Sam',
    last_name: 'Viewer',
    role: 'VIEWER',
    programs: [
      { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System', is_default: true },
    ],
  },
]

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  admin: 'admin123',
  depot_mgr: 'depot123',
  field_tech: 'field123',
  viewer: 'viewer123',
}

// Mock JWT token generator (simple base64 encoding for testing)
function generateMockToken(userId: number): string {
  const payload = { userId, iat: Date.now(), exp: Date.now() + 30 * 60 * 1000 }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Parse mock token
function parseMockToken(token: string): { userId: number } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    if (payload.exp < Date.now()) return null // Token expired
    return payload
  } catch {
    return null
  }
}

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  const user = mockUsers.find(u => u.username === username)
  if (!user || mockPasswords[username] !== password) {
    return res.status(401).json({ error: 'Invalid username or password' })
  }

  const token = generateMockToken(user.user_id)
  res.json({ token, user })
})

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const token = authHeader.substring(7)
  const payload = parseMockToken(token)

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const user = mockUsers.find(u => u.user_id === payload.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  res.json({ user })
})

// Token refresh endpoint
app.post('/api/auth/refresh', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const token = authHeader.substring(7)
  const payload = parseMockToken(token)

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const user = mockUsers.find(u => u.user_id === payload.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  // Generate a new token with extended expiration
  const newToken = generateMockToken(user.user_id)
  console.log(`[AUTH] Token refreshed for user: ${user.username}`)
  res.json({ token: newToken, user })
})

// Logout endpoint
app.post('/api/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully' })
})

// Change password endpoint
app.post('/api/auth/change-password', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const token = authHeader.substring(7)
  const payload = parseMockToken(token)

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const user = mockUsers.find(u => u.user_id === payload.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  const { currentPassword, newPassword, confirmPassword } = req.body

  // Validate required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'All password fields are required' })
  }

  // Verify current password
  if (mockPasswords[user.username] !== currentPassword) {
    return res.status(400).json({ error: 'Current password is incorrect' })
  }

  // Verify new passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' })
  }

  // Validate new password requirements (12+ chars, uppercase, lowercase, number, special char)
  if (newPassword.length < 12) {
    return res.status(400).json({ error: 'Password must be at least 12 characters' })
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one uppercase letter' })
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one lowercase letter' })
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one number' })
  }
  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one special character' })
  }

  // Check new password is different from current
  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password must be different from current password' })
  }

  // Update the password
  mockPasswords[user.username] = newPassword

  console.log(`[AUTH] Password changed for user: ${user.username}`)

  res.json({ message: 'Password changed successfully' })
})

// Update own profile endpoint (for any authenticated user)
app.put('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const token = authHeader.substring(7)
  const payload = parseMockToken(token)

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const userIndex = mockUsers.findIndex(u => u.user_id === payload.userId)
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
  }

  const existingUser = mockUsers[userIndex]
  const { email, first_name, last_name } = req.body

  // Validate required fields
  if (!email || !first_name || !last_name) {
    return res.status(400).json({ error: 'Email, first name, and last name are required' })
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  // Check for duplicate email (excluding current user)
  if (mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.user_id !== payload.userId)) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  // Update the user (only email, first_name, last_name - no role/programs/username changes)
  const updatedUser = {
    ...existingUser,
    email,
    first_name,
    last_name,
  }

  mockUsers[userIndex] = updatedUser

  console.log(`[PROFILE] User profile updated: ${existingUser.username} (ID: ${payload.userId})`)

  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  })
})

// Programs list
const allPrograms = [
  { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System' },
  { pgm_id: 2, pgm_cd: 'ACTS', pgm_name: 'Advanced Targeting Capability System' },
  { pgm_id: 3, pgm_cd: 'ARDS', pgm_name: 'Airborne Reconnaissance Data System' },
  { pgm_id: 4, pgm_cd: '236', pgm_name: 'Program 236' },
]

// Asset status codes
const assetStatusCodes = [
  { status_cd: 'FMC', status_name: 'Full Mission Capable', description: 'Asset is fully operational and mission ready' },
  { status_cd: 'PMC', status_name: 'Partial Mission Capable', description: 'Asset can perform some but not all mission types' },
  { status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', description: 'Asset is down due to maintenance requirements' },
  { status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', description: 'Asset is down awaiting parts/supplies' },
  { status_cd: 'CNDM', status_name: 'Cannot Determine Mission', description: 'Asset status cannot be determined' },
]

// Mock asset data for different programs
const mockAssets = [
  // CRIIS program assets (pgm_id: 1)
  { asset_id: 1, serno: 'CRIIS-001', partno: 'PN-SENSOR-A', pgm_id: 1, status_cd: 'FMC', active: true },
  { asset_id: 2, serno: 'CRIIS-002', partno: 'PN-SENSOR-A', pgm_id: 1, status_cd: 'FMC', active: true },
  { asset_id: 3, serno: 'CRIIS-003', partno: 'PN-SENSOR-B', pgm_id: 1, status_cd: 'PMC', active: true },
  { asset_id: 4, serno: 'CRIIS-004', partno: 'PN-CAMERA-X', pgm_id: 1, status_cd: 'FMC', active: true },
  { asset_id: 5, serno: 'CRIIS-005', partno: 'PN-CAMERA-X', pgm_id: 1, status_cd: 'NMCM', active: true },
  { asset_id: 6, serno: 'CRIIS-006', partno: 'PN-RADAR-01', pgm_id: 1, status_cd: 'NMCS', active: true },
  { asset_id: 7, serno: 'CRIIS-007', partno: 'PN-RADAR-01', pgm_id: 1, status_cd: 'FMC', active: true },
  { asset_id: 8, serno: 'CRIIS-008', partno: 'PN-COMM-SYS', pgm_id: 1, status_cd: 'PMC', active: true },
  { asset_id: 9, serno: 'CRIIS-009', partno: 'PN-COMM-SYS', pgm_id: 1, status_cd: 'CNDM', active: true },
  { asset_id: 10, serno: 'CRIIS-010', partno: 'PN-NAV-UNIT', pgm_id: 1, status_cd: 'FMC', active: true },

  // ACTS program assets (pgm_id: 2)
  { asset_id: 11, serno: 'ACTS-001', partno: 'PN-TARGET-A', pgm_id: 2, status_cd: 'FMC', active: true },
  { asset_id: 12, serno: 'ACTS-002', partno: 'PN-TARGET-A', pgm_id: 2, status_cd: 'FMC', active: true },
  { asset_id: 13, serno: 'ACTS-003', partno: 'PN-TARGET-B', pgm_id: 2, status_cd: 'NMCM', active: true },
  { asset_id: 14, serno: 'ACTS-004', partno: 'PN-LASER-SYS', pgm_id: 2, status_cd: 'PMC', active: true },
  { asset_id: 15, serno: 'ACTS-005', partno: 'PN-LASER-SYS', pgm_id: 2, status_cd: 'NMCS', active: true },
  { asset_id: 16, serno: 'ACTS-006', partno: 'PN-OPTICS-01', pgm_id: 2, status_cd: 'FMC', active: true },

  // ARDS program assets (pgm_id: 3)
  { asset_id: 17, serno: 'ARDS-001', partno: 'PN-DATA-SYS', pgm_id: 3, status_cd: 'FMC', active: true },
  { asset_id: 18, serno: 'ARDS-002', partno: 'PN-DATA-SYS', pgm_id: 3, status_cd: 'FMC', active: true },
  { asset_id: 19, serno: 'ARDS-003', partno: 'PN-RECON-CAM', pgm_id: 3, status_cd: 'PMC', active: true },
  { asset_id: 20, serno: 'ARDS-004', partno: 'PN-RECON-CAM', pgm_id: 3, status_cd: 'NMCM', active: true },
  { asset_id: 21, serno: 'ARDS-005', partno: 'PN-LINK-SYS', pgm_id: 3, status_cd: 'CNDM', active: true },

  // Program 236 assets (pgm_id: 4)
  { asset_id: 22, serno: '236-001', partno: 'PN-SPEC-001', pgm_id: 4, status_cd: 'FMC', active: true },
  { asset_id: 23, serno: '236-002', partno: 'PN-SPEC-001', pgm_id: 4, status_cd: 'NMCS', active: true },
  { asset_id: 24, serno: '236-003', partno: 'PN-SPEC-002', pgm_id: 4, status_cd: 'PMC', active: true },
  { asset_id: 25, serno: '236-004', partno: 'PN-SPEC-003', pgm_id: 4, status_cd: 'FMC', active: true },
]

// Authentication middleware helper
function authenticateRequest(req: express.Request, res: express.Response): { userId: number } | null {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Not authenticated' })
    return null
  }

  const token = authHeader.substring(7)
  const payload = parseMockToken(token)

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' })
    return null
  }

  return payload
}

// Check if user is admin
function requireAdmin(req: express.Request, res: express.Response): boolean {
  const payload = authenticateRequest(req, res)
  if (!payload) return false

  const user = mockUsers.find(u => u.user_id === payload.userId)
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' })
    return false
  }

  return true
}

// Get all users (admin only)
app.get('/api/users', (req, res) => {
  if (!requireAdmin(req, res)) return

  // Return users without password information
  const usersWithActive = mockUsers.map(u => ({
    ...u,
    active: true,
  }))

  res.json({ users: usersWithActive })
})

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
  if (!requireAdmin(req, res)) return

  const userId = parseInt(req.params.id, 10)
  const user = mockUsers.find(u => u.user_id === userId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({ user: { ...user, active: true } })
})

// Update user by ID (admin only)
app.put('/api/users/:id', (req, res) => {
  if (!requireAdmin(req, res)) return

  const userId = parseInt(req.params.id, 10)
  const userIndex = mockUsers.findIndex(u => u.user_id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
  }

  const { username, email, first_name, last_name, role, password, program_ids, default_program_id, active } = req.body
  const existingUser = mockUsers[userIndex]

  // Validate required fields
  if (!username || !email || !first_name || !last_name || !role || !program_ids) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Validate username format
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' })
  }

  // Check for duplicate username (excluding current user)
  if (mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.user_id !== userId)) {
    return res.status(400).json({ error: 'Username already exists' })
  }

  // Check for duplicate email (excluding current user)
  if (mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.user_id !== userId)) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  // Validate role
  const validRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN', 'VIEWER']
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  // Validate program_ids
  if (!Array.isArray(program_ids) || program_ids.length === 0) {
    return res.status(400).json({ error: 'At least one program must be selected' })
  }

  // If password is provided, validate it
  if (password) {
    if (password.length < 12) {
      return res.status(400).json({ error: 'Password must be at least 12 characters' })
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one uppercase letter' })
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one lowercase letter' })
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one number' })
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one special character' })
    }
    // Update password
    mockPasswords[username] = password
    // If username changed, remove old password entry
    if (existingUser.username !== username) {
      delete mockPasswords[existingUser.username]
    }
  } else if (existingUser.username !== username) {
    // If username changed but no new password, move password to new username
    mockPasswords[username] = mockPasswords[existingUser.username]
    delete mockPasswords[existingUser.username]
  }

  // Build programs array with is_default flag
  // Use default_program_id if provided and valid, otherwise use first program
  const effectiveDefaultId = default_program_id && program_ids.includes(default_program_id)
    ? default_program_id
    : program_ids[0]

  const programs = program_ids.map((pgmId: number) => {
    const program = allPrograms.find(p => p.pgm_id === pgmId)
    if (!program) {
      throw new Error(`Invalid program ID: ${pgmId}`)
    }
    return {
      ...program,
      is_default: pgmId === effectiveDefaultId
    }
  })

  // Update the user
  const updatedUser = {
    user_id: userId,
    username,
    email,
    first_name,
    last_name,
    role,
    programs,
  }

  mockUsers[userIndex] = updatedUser

  const defaultProgramCode = programs.find(p => p.is_default)?.pgm_cd || 'none'
  console.log(`[USERS] User updated: ${username} (ID: ${userId}, Role: ${role}, Default Program: ${defaultProgramCode})`)

  res.json({
    message: 'User updated successfully',
    user: { ...updatedUser, active: active !== false }
  })
})

// Delete user by ID (admin only)
app.delete('/api/users/:id', (req, res) => {
  if (!requireAdmin(req, res)) return

  const userId = parseInt(req.params.id, 10)
  const userIndex = mockUsers.findIndex(u => u.user_id === userId)

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' })
  }

  const user = mockUsers[userIndex]

  // Remove user from mock data
  mockUsers.splice(userIndex, 1)

  // Remove password entry
  delete mockPasswords[user.username]

  console.log(`[USERS] User deleted: ${user.username} (ID: ${userId})`)

  res.json({
    message: 'User deleted successfully',
    user: { user_id: userId, username: user.username }
  })
})

// Create new user (admin only)
app.post('/api/users', (req, res) => {
  if (!requireAdmin(req, res)) return

  const { username, email, first_name, last_name, role, password, program_ids } = req.body

  // Validate required fields
  if (!username || !email || !first_name || !last_name || !role || !password || !program_ids) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Validate username format
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' })
  }

  // Check for duplicate username
  if (mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: 'Username already exists' })
  }

  // Check for duplicate email
  if (mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  // Validate role
  const validRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN', 'VIEWER']
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }

  // Validate program_ids
  if (!Array.isArray(program_ids) || program_ids.length === 0) {
    return res.status(400).json({ error: 'At least one program must be selected' })
  }

  // Validate password requirements
  if (password.length < 12) {
    return res.status(400).json({ error: 'Password must be at least 12 characters' })
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one uppercase letter' })
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one lowercase letter' })
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one number' })
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one special character' })
  }

  // Generate new user ID
  const newUserId = Math.max(...mockUsers.map(u => u.user_id)) + 1

  // Build programs array with is_default flag
  const programs = program_ids.map((pgmId: number, index: number) => {
    const program = allPrograms.find(p => p.pgm_id === pgmId)
    if (!program) {
      throw new Error(`Invalid program ID: ${pgmId}`)
    }
    return {
      ...program,
      is_default: index === 0 // First program is default
    }
  })

  // Create the new user
  const newUser = {
    user_id: newUserId,
    username,
    email,
    first_name,
    last_name,
    role,
    programs,
  }

  // Add to mock data
  mockUsers.push(newUser)
  mockPasswords[username] = password

  console.log(`[USERS] New user created: ${username} (ID: ${newUserId}, Role: ${role})`)

  res.status(201).json({
    message: 'User created successfully',
    user: { ...newUser, active: true }
  })
})

// Dashboard: Get asset status summary (requires authentication)
app.get('/api/dashboard/asset-status', (req, res) => {
  const payload = authenticateRequest(req, res)
  if (!payload) return

  const user = mockUsers.find(u => u.user_id === payload.userId)
  if (!user) {
    return res.status(401).json({ error: 'User not found' })
  }

  // Get the program ID from query param, or use user's default program
  let programId = parseInt(req.query.program_id as string, 10)
  if (isNaN(programId)) {
    // Default to user's default program
    const defaultProgram = user.programs.find(p => p.is_default)
    programId = defaultProgram?.pgm_id || user.programs[0]?.pgm_id || 1
  }

  // Check if user has access to this program
  if (!user.programs.find(p => p.pgm_id === programId) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this program' })
  }

  // Get assets for the selected program
  const programAssets = mockAssets.filter(a => a.pgm_id === programId && a.active)

  // Count assets by status
  const statusCounts: Record<string, number> = {
    FMC: 0,
    PMC: 0,
    NMCM: 0,
    NMCS: 0,
    CNDM: 0,
  }

  programAssets.forEach(asset => {
    if (statusCounts.hasOwnProperty(asset.status_cd)) {
      statusCounts[asset.status_cd]++
    }
  })

  // Build response with status details
  const statusSummary = assetStatusCodes.map(status => ({
    status_cd: status.status_cd,
    status_name: status.status_name,
    description: status.description,
    count: statusCounts[status.status_cd] || 0,
  }))

  const totalAssets = programAssets.length

  // Calculate mission capability rate (FMC + PMC as capable)
  const missionCapable = statusCounts.FMC + statusCounts.PMC
  const missionCapabilityRate = totalAssets > 0 ? Math.round((missionCapable / totalAssets) * 100) : 0

  res.json({
    program_id: programId,
    program_cd: allPrograms.find(p => p.pgm_id === programId)?.pgm_cd || 'UNKNOWN',
    total_assets: totalAssets,
    mission_capability_rate: missionCapabilityRate,
    status_summary: statusSummary,
  })
})

// Mock PMI data for testing
interface PMIRecord {
  pmi_id: number;
  asset_id: number;
  asset_sn: string;
  asset_name: string;
  pmi_type: string;
  wuc_cd: string;
  next_due_date: string;
  days_until_due: number;
  completed_date: string | null;
  pgm_id: number;
  status: 'overdue' | 'due_soon' | 'upcoming' | 'completed';
}

// Helper to calculate days until due
function calculateDaysUntilDue(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper to determine PMI status based on days until due
function getPMIStatus(daysUntilDue: number): PMIRecord['status'] {
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 7) return 'due_soon';  // Red - within 7 days
  if (daysUntilDue <= 30) return 'upcoming'; // Yellow - 8-30 days
  return 'upcoming'; // Green - after 30 days
}

// Generate dynamic PMI data based on current date
function generateMockPMIData(): PMIRecord[] {
  const today = new Date();

  // Helper to create date strings
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const pmiRecords: PMIRecord[] = [
    // Red items - due within 7 days (including overdue)
    {
      pmi_id: 1,
      asset_id: 101,
      asset_sn: 'SN-2024-001',
      asset_name: 'ECU Assembly A',
      pmi_type: '30-Day Inspection',
      wuc_cd: '14AAA',
      next_due_date: addDays(-2), // Overdue by 2 days
      days_until_due: -2,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'overdue',
    },
    {
      pmi_id: 2,
      asset_id: 102,
      asset_sn: 'SN-2024-002',
      asset_name: 'Sensor Unit B',
      pmi_type: '90-Day Calibration',
      wuc_cd: '23BBB',
      next_due_date: addDays(3), // Due in 3 days
      days_until_due: 3,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'due_soon',
    },
    {
      pmi_id: 3,
      asset_id: 103,
      asset_sn: 'SN-2024-003',
      asset_name: 'Power Supply C',
      pmi_type: '60-Day Check',
      wuc_cd: '41CCC',
      next_due_date: addDays(7), // Due in 7 days (last red day)
      days_until_due: 7,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'due_soon',
    },
    // Yellow items - due in 8-30 days
    {
      pmi_id: 4,
      asset_id: 104,
      asset_sn: 'SN-2024-004',
      asset_name: 'Display Module D',
      pmi_type: '180-Day Service',
      wuc_cd: '74DDD',
      next_due_date: addDays(12), // Due in 12 days
      days_until_due: 12,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
    },
    {
      pmi_id: 5,
      asset_id: 105,
      asset_sn: 'SN-2024-005',
      asset_name: 'Communication Radio E',
      pmi_type: '365-Day Overhaul',
      wuc_cd: '62EEE',
      next_due_date: addDays(21), // Due in 21 days
      days_until_due: 21,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
    },
    {
      pmi_id: 6,
      asset_id: 106,
      asset_sn: 'SN-2024-006',
      asset_name: 'Navigation System F',
      pmi_type: '30-Day Inspection',
      wuc_cd: '71FFF',
      next_due_date: addDays(28), // Due in 28 days
      days_until_due: 28,
      completed_date: null,
      pgm_id: 2, // ACTS
      status: 'upcoming',
    },
    // Green items - due after 30 days
    {
      pmi_id: 7,
      asset_id: 107,
      asset_sn: 'SN-2024-007',
      asset_name: 'Camera Assembly G',
      pmi_type: '90-Day Calibration',
      wuc_cd: '13GGG',
      next_due_date: addDays(45), // Due in 45 days
      days_until_due: 45,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
    },
    {
      pmi_id: 8,
      asset_id: 108,
      asset_sn: 'SN-2024-008',
      asset_name: 'Antenna Array H',
      pmi_type: '180-Day Service',
      wuc_cd: '25HHH',
      next_due_date: addDays(90), // Due in 90 days
      days_until_due: 90,
      completed_date: null,
      pgm_id: 3, // ARDS
      status: 'upcoming',
    },
    {
      pmi_id: 9,
      asset_id: 109,
      asset_sn: 'SN-2024-009',
      asset_name: 'Processing Unit I',
      pmi_type: '365-Day Overhaul',
      wuc_cd: '52III',
      next_due_date: addDays(120), // Due in 120 days
      days_until_due: 120,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
    },
    // Additional items for different programs
    {
      pmi_id: 10,
      asset_id: 110,
      asset_sn: 'SN-2024-010',
      asset_name: 'Targeting Computer J',
      pmi_type: '60-Day Check',
      wuc_cd: '33JJJ',
      next_due_date: addDays(5), // Red - ACTS
      days_until_due: 5,
      completed_date: null,
      pgm_id: 2, // ACTS
      status: 'due_soon',
    },
  ];

  // Update days_until_due and status dynamically
  return pmiRecords.map(pmi => {
    const daysUntilDue = calculateDaysUntilDue(pmi.next_due_date);
    return {
      ...pmi,
      days_until_due: daysUntilDue,
      status: getPMIStatus(daysUntilDue),
    };
  });
}

// Get PMI due soon endpoint (with optional program filtering)
app.get('/api/pmi/due-soon', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get program filter from query string (optional)
  const programIdFilter = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;

  // Generate fresh PMI data
  const allPMI = generateMockPMIData();

  // Filter PMI records by user's accessible programs
  let filteredPMI = allPMI.filter(pmi => userProgramIds.includes(pmi.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredPMI = filteredPMI.filter(pmi => pmi.pgm_id === programIdFilter);
  }

  // Sort by days_until_due (most urgent first)
  filteredPMI.sort((a, b) => a.days_until_due - b.days_until_due);

  // Calculate summary counts
  const summary = {
    overdue: filteredPMI.filter(p => p.days_until_due < 0).length,
    red: filteredPMI.filter(p => p.days_until_due >= 0 && p.days_until_due <= 7).length,
    yellow: filteredPMI.filter(p => p.days_until_due > 7 && p.days_until_due <= 30).length,
    green: filteredPMI.filter(p => p.days_until_due > 30).length,
    total: filteredPMI.length,
  };

  console.log(`[PMI] Due soon request by ${user.username} - Total: ${summary.total}, Red: ${summary.red + summary.overdue}, Yellow: ${summary.yellow}, Green: ${summary.green}`);

  res.json({
    pmi: filteredPMI,
    summary,
  });
});

// Get single PMI by ID
app.get('/api/pmi/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const pmiId = parseInt(req.params.id, 10);
  const allPMI = generateMockPMIData();
  const pmi = allPMI.find(p => p.pmi_id === pmiId);

  if (!pmi) {
    return res.status(404).json({ error: 'PMI record not found' });
  }

  // Check if user has access to this PMI's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(pmi.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this PMI record' });
  }

  res.json({ pmi });
});

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
