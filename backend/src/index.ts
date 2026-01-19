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

// Location options
const adminLocations = [
  { loc_id: 1, loc_cd: 'DEPOT-A', loc_name: 'Depot Alpha' },
  { loc_id: 2, loc_cd: 'DEPOT-B', loc_name: 'Depot Beta' },
  { loc_id: 3, loc_cd: 'DEPOT-C', loc_name: 'Depot Charlie' },
  { loc_id: 4, loc_cd: 'FIELD-1', loc_name: 'Field Site 1' },
  { loc_id: 5, loc_cd: 'FIELD-2', loc_name: 'Field Site 2' },
  { loc_id: 6, loc_cd: 'HQ', loc_name: 'Headquarters' },
]

const custodialLocations = [
  { loc_id: 1, loc_cd: 'MAINT-BAY-1', loc_name: 'Maintenance Bay 1' },
  { loc_id: 2, loc_cd: 'MAINT-BAY-2', loc_name: 'Maintenance Bay 2' },
  { loc_id: 3, loc_cd: 'STORAGE-A', loc_name: 'Storage Area A' },
  { loc_id: 4, loc_cd: 'STORAGE-B', loc_name: 'Storage Area B' },
  { loc_id: 5, loc_cd: 'FIELD-OPS', loc_name: 'Field Operations' },
  { loc_id: 6, loc_cd: 'AIRCRAFT-1', loc_name: 'Aircraft 1' },
  { loc_id: 7, loc_cd: 'AIRCRAFT-2', loc_name: 'Aircraft 2' },
]

// Asset interface for typed data
interface Asset {
  asset_id: number
  serno: string
  partno: string
  name: string
  pgm_id: number
  status_cd: string
  admin_loc: string
  cust_loc: string
  notes: string
  active: boolean
  created_date: string
}

// Mock asset data for different programs
const mockAssets: Asset[] = [
  // CRIIS program assets (pgm_id: 1)
  { asset_id: 1, serno: 'CRIIS-001', partno: 'PN-SENSOR-A', name: 'Sensor Unit A', pgm_id: 1, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'MAINT-BAY-1', notes: 'Primary sensor unit', active: true, created_date: '2024-01-15' },
  { asset_id: 2, serno: 'CRIIS-002', partno: 'PN-SENSOR-A', name: 'Sensor Unit A (Backup)', pgm_id: 1, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'STORAGE-A', notes: 'Backup sensor unit', active: true, created_date: '2024-01-15' },
  { asset_id: 3, serno: 'CRIIS-003', partno: 'PN-SENSOR-B', name: 'Sensor Unit B', pgm_id: 1, status_cd: 'PMC', admin_loc: 'FIELD-1', cust_loc: 'AIRCRAFT-1', notes: 'Minor calibration needed', active: true, created_date: '2024-02-01' },
  { asset_id: 4, serno: 'CRIIS-004', partno: 'PN-CAMERA-X', name: 'Camera System X', pgm_id: 1, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'MAINT-BAY-2', notes: '', active: true, created_date: '2024-02-10' },
  { asset_id: 5, serno: 'CRIIS-005', partno: 'PN-CAMERA-X', name: 'Camera System X-2', pgm_id: 1, status_cd: 'NMCM', admin_loc: 'DEPOT-A', cust_loc: 'MAINT-BAY-1', notes: 'Intermittent power failure', active: true, created_date: '2024-02-10' },
  { asset_id: 6, serno: 'CRIIS-006', partno: 'PN-RADAR-01', name: 'Radar Unit 01', pgm_id: 1, status_cd: 'NMCS', admin_loc: 'FIELD-1', cust_loc: 'FIELD-OPS', notes: 'Awaiting power supply module', active: true, created_date: '2024-03-01' },
  { asset_id: 7, serno: 'CRIIS-007', partno: 'PN-RADAR-01', name: 'Radar Unit 02', pgm_id: 1, status_cd: 'FMC', admin_loc: 'DEPOT-B', cust_loc: 'STORAGE-B', notes: '', active: true, created_date: '2024-03-01' },
  { asset_id: 8, serno: 'CRIIS-008', partno: 'PN-COMM-SYS', name: 'Communication System', pgm_id: 1, status_cd: 'PMC', admin_loc: 'FIELD-2', cust_loc: 'AIRCRAFT-2', notes: 'Software update pending', active: true, created_date: '2024-03-15' },
  { asset_id: 9, serno: 'CRIIS-009', partno: 'PN-COMM-SYS', name: 'Communication System (Backup)', pgm_id: 1, status_cd: 'CNDM', admin_loc: 'HQ', cust_loc: 'STORAGE-A', notes: 'Status to be determined', active: true, created_date: '2024-03-15' },
  { asset_id: 10, serno: 'CRIIS-010', partno: 'PN-NAV-UNIT', name: 'Navigation Unit', pgm_id: 1, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'AIRCRAFT-1', notes: '', active: true, created_date: '2024-04-01' },

  // ACTS program assets (pgm_id: 2)
  { asset_id: 11, serno: 'ACTS-001', partno: 'PN-TARGET-A', name: 'Targeting System A', pgm_id: 2, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'MAINT-BAY-1', notes: '', active: true, created_date: '2024-01-20' },
  { asset_id: 12, serno: 'ACTS-002', partno: 'PN-TARGET-A', name: 'Targeting System A (Secondary)', pgm_id: 2, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'STORAGE-A', notes: '', active: true, created_date: '2024-01-20' },
  { asset_id: 13, serno: 'ACTS-003', partno: 'PN-TARGET-B', name: 'Targeting System B', pgm_id: 2, status_cd: 'NMCM', admin_loc: 'DEPOT-B', cust_loc: 'MAINT-BAY-2', notes: 'BIT failure - optical alignment issue', active: true, created_date: '2024-02-15' },
  { asset_id: 14, serno: 'ACTS-004', partno: 'PN-LASER-SYS', name: 'Laser System', pgm_id: 2, status_cd: 'PMC', admin_loc: 'FIELD-1', cust_loc: 'AIRCRAFT-1', notes: 'Minor alignment adjustment needed', active: true, created_date: '2024-03-01' },
  { asset_id: 15, serno: 'ACTS-005', partno: 'PN-LASER-SYS', name: 'Laser System (Backup)', pgm_id: 2, status_cd: 'NMCS', admin_loc: 'FIELD-2', cust_loc: 'FIELD-OPS', notes: 'Awaiting laser diode replacement', active: true, created_date: '2024-03-01' },
  { asset_id: 16, serno: 'ACTS-006', partno: 'PN-OPTICS-01', name: 'Optical Assembly', pgm_id: 2, status_cd: 'FMC', admin_loc: 'DEPOT-A', cust_loc: 'MAINT-BAY-1', notes: '', active: true, created_date: '2024-04-15' },

  // ARDS program assets (pgm_id: 3)
  { asset_id: 17, serno: 'ARDS-001', partno: 'PN-DATA-SYS', name: 'Data Processing System', pgm_id: 3, status_cd: 'FMC', admin_loc: 'DEPOT-C', cust_loc: 'MAINT-BAY-1', notes: '', active: true, created_date: '2024-02-01' },
  { asset_id: 18, serno: 'ARDS-002', partno: 'PN-DATA-SYS', name: 'Data Processing System (Backup)', pgm_id: 3, status_cd: 'FMC', admin_loc: 'DEPOT-C', cust_loc: 'STORAGE-B', notes: '', active: true, created_date: '2024-02-01' },
  { asset_id: 19, serno: 'ARDS-003', partno: 'PN-RECON-CAM', name: 'Reconnaissance Camera', pgm_id: 3, status_cd: 'PMC', admin_loc: 'FIELD-1', cust_loc: 'AIRCRAFT-2', notes: 'Lens cleaning needed', active: true, created_date: '2024-03-10' },
  { asset_id: 20, serno: 'ARDS-004', partno: 'PN-RECON-CAM', name: 'Reconnaissance Camera (Secondary)', pgm_id: 3, status_cd: 'NMCM', admin_loc: 'DEPOT-B', cust_loc: 'MAINT-BAY-2', notes: 'Recalibration in progress', active: true, created_date: '2024-03-10' },
  { asset_id: 21, serno: 'ARDS-005', partno: 'PN-LINK-SYS', name: 'Data Link System', pgm_id: 3, status_cd: 'CNDM', admin_loc: 'HQ', cust_loc: 'STORAGE-A', notes: 'Under evaluation', active: true, created_date: '2024-04-01' },

  // Program 236 assets (pgm_id: 4)
  { asset_id: 22, serno: '236-001', partno: 'PN-SPEC-001', name: 'Special Unit 001', pgm_id: 4, status_cd: 'FMC', admin_loc: 'HQ', cust_loc: 'STORAGE-A', notes: 'Classified', active: true, created_date: '2024-01-01' },
  { asset_id: 23, serno: '236-002', partno: 'PN-SPEC-001', name: 'Special Unit 002', pgm_id: 4, status_cd: 'NMCS', admin_loc: 'HQ', cust_loc: 'MAINT-BAY-1', notes: 'Awaiting classified component', active: true, created_date: '2024-01-01' },
  { asset_id: 24, serno: '236-003', partno: 'PN-SPEC-002', name: 'Special Unit 003', pgm_id: 4, status_cd: 'PMC', admin_loc: 'HQ', cust_loc: 'FIELD-OPS', notes: '', active: true, created_date: '2024-02-01' },
  { asset_id: 25, serno: '236-004', partno: 'PN-SPEC-003', name: 'Special Unit 004', pgm_id: 4, status_cd: 'FMC', admin_loc: 'HQ', cust_loc: 'STORAGE-B', notes: '', active: true, created_date: '2024-03-01' },
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

// Mock Maintenance Events data
interface MaintenanceEvent {
  event_id: number;
  asset_id: number;
  asset_sn: string;
  asset_name: string;
  job_no: string;
  discrepancy: string;
  start_job: string;
  stop_job: string | null;
  event_type: 'Standard' | 'PMI' | 'TCTO' | 'BIT/PC';
  priority: 'Routine' | 'Urgent' | 'Critical';
  status: 'open' | 'closed';
  pgm_id: number;
  location: string;
}

// Generate mock maintenance events
function generateMockMaintenanceEvents(): MaintenanceEvent[] {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return [
    // Open events - CRIIS program
    {
      event_id: 1,
      asset_id: 5,
      asset_sn: 'CRIIS-005',
      asset_name: 'Camera System X',
      job_no: 'MX-2024-001',
      discrepancy: 'Intermittent power failure during operation',
      start_job: addDays(-5),
      stop_job: null,
      event_type: 'Standard',
      priority: 'Critical',
      status: 'open',
      pgm_id: 1,
      location: 'Depot Alpha',
    },
    {
      event_id: 2,
      asset_id: 6,
      asset_sn: 'CRIIS-006',
      asset_name: 'Radar Unit 01',
      job_no: 'MX-2024-002',
      discrepancy: 'Awaiting replacement parts - power supply module',
      start_job: addDays(-10),
      stop_job: null,
      event_type: 'Standard',
      priority: 'Urgent',
      status: 'open',
      pgm_id: 1,
      location: 'Field Site Bravo',
    },
    {
      event_id: 3,
      asset_id: 3,
      asset_sn: 'CRIIS-003',
      asset_name: 'Sensor Unit B',
      job_no: 'MX-2024-003',
      discrepancy: 'Scheduled PMI - 90-day calibration',
      start_job: addDays(-2),
      stop_job: null,
      event_type: 'PMI',
      priority: 'Routine',
      status: 'open',
      pgm_id: 1,
      location: 'Depot Alpha',
    },
    {
      event_id: 4,
      asset_id: 8,
      asset_sn: 'CRIIS-008',
      asset_name: 'Communication System',
      job_no: 'MX-2024-004',
      discrepancy: 'Software update required per TCTO 2024-15',
      start_job: addDays(-1),
      stop_job: null,
      event_type: 'TCTO',
      priority: 'Urgent',
      status: 'open',
      pgm_id: 1,
      location: 'Field Site Charlie',
    },
    // Open events - ACTS program
    {
      event_id: 5,
      asset_id: 13,
      asset_sn: 'ACTS-003',
      asset_name: 'Targeting System B',
      job_no: 'MX-2024-005',
      discrepancy: 'BIT failure code 0x4A2 - optical alignment issue',
      start_job: addDays(-3),
      stop_job: null,
      event_type: 'BIT/PC',
      priority: 'Critical',
      status: 'open',
      pgm_id: 2,
      location: 'Depot Alpha',
    },
    {
      event_id: 6,
      asset_id: 15,
      asset_sn: 'ACTS-005',
      asset_name: 'Laser System',
      job_no: 'MX-2024-006',
      discrepancy: 'NMCS - awaiting laser diode replacement',
      start_job: addDays(-7),
      stop_job: null,
      event_type: 'Standard',
      priority: 'Urgent',
      status: 'open',
      pgm_id: 2,
      location: 'Field Site Delta',
    },
    // Open events - ARDS program
    {
      event_id: 7,
      asset_id: 20,
      asset_sn: 'ARDS-004',
      asset_name: 'Reconnaissance Camera',
      job_no: 'MX-2024-007',
      discrepancy: 'Lens cleaning and recalibration required',
      start_job: addDays(-1),
      stop_job: null,
      event_type: 'PMI',
      priority: 'Routine',
      status: 'open',
      pgm_id: 3,
      location: 'Depot Beta',
    },
    // Closed events (for history)
    {
      event_id: 8,
      asset_id: 1,
      asset_sn: 'CRIIS-001',
      asset_name: 'Sensor Unit A',
      job_no: 'MX-2024-008',
      discrepancy: '30-day inspection completed',
      start_job: addDays(-15),
      stop_job: addDays(-12),
      event_type: 'PMI',
      priority: 'Routine',
      status: 'closed',
      pgm_id: 1,
      location: 'Depot Alpha',
    },
    {
      event_id: 9,
      asset_id: 11,
      asset_sn: 'ACTS-001',
      asset_name: 'Targeting System A',
      job_no: 'MX-2024-009',
      discrepancy: 'Annual calibration completed',
      start_job: addDays(-20),
      stop_job: addDays(-18),
      event_type: 'PMI',
      priority: 'Routine',
      status: 'closed',
      pgm_id: 2,
      location: 'Depot Alpha',
    },
    // Program 236 open event
    {
      event_id: 10,
      asset_id: 23,
      asset_sn: '236-002',
      asset_name: 'Special Unit 001',
      job_no: 'MX-2024-010',
      discrepancy: 'Awaiting parts - classified component',
      start_job: addDays(-4),
      stop_job: null,
      event_type: 'Standard',
      priority: 'Urgent',
      status: 'open',
      pgm_id: 4,
      location: 'Secure Facility',
    },
  ];
}

// Dashboard: Get open maintenance jobs (requires authentication)
app.get('/api/dashboard/open-maintenance-jobs', (req, res) => {
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

  // Generate maintenance events
  const allEvents = generateMockMaintenanceEvents();

  // Filter by user's accessible programs and open status
  let filteredEvents = allEvents.filter(
    event => event.status === 'open' && userProgramIds.includes(event.pgm_id)
  );

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredEvents = filteredEvents.filter(event => event.pgm_id === programIdFilter);
  }

  // Sort by priority (Critical first, then Urgent, then Routine)
  const priorityOrder: Record<string, number> = { Critical: 0, Urgent: 1, Routine: 2 };
  filteredEvents.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Calculate summary counts
  const summary = {
    critical: filteredEvents.filter(e => e.priority === 'Critical').length,
    urgent: filteredEvents.filter(e => e.priority === 'Urgent').length,
    routine: filteredEvents.filter(e => e.priority === 'Routine').length,
    total: filteredEvents.length,
  };

  console.log(`[MAINTENANCE] Open jobs request by ${user.username} - Total: ${summary.total}, Critical: ${summary.critical}, Urgent: ${summary.urgent}, Routine: ${summary.routine}`);

  res.json({
    events: filteredEvents,
    summary,
  });
});

// Get single maintenance event by ID
app.get('/api/events/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const eventId = parseInt(req.params.id, 10);
  const allEvents = generateMockMaintenanceEvents();
  const event = allEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  res.json({ event });
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

// Mock Parts Order data for testing
interface PartsOrder {
  order_id: number;
  part_no: string;
  part_name: string;
  nsn: string;
  qty_ordered: number;
  qty_received: number;
  unit_price: number;
  order_date: string;
  status: 'pending' | 'acknowledged' | 'shipped' | 'received' | 'cancelled';
  requestor_id: number;
  requestor_name: string;
  asset_sn: string | null;
  asset_name: string | null;
  job_no: string | null;
  priority: 'routine' | 'urgent' | 'critical';
  pgm_id: number;
  notes: string;
  shipping_tracking: string | null;
  estimated_delivery: string | null;
}

// Generate mock parts order data
function generateMockPartsOrders(): PartsOrder[] {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return [
    // Pending orders (waiting for acknowledgment) - CRIIS
    {
      order_id: 1,
      part_no: 'PN-PSU-001',
      part_name: 'Power Supply Unit 24V',
      nsn: '6130-01-555-1234',
      qty_ordered: 2,
      qty_received: 0,
      unit_price: 1250.00,
      order_date: addDays(-3),
      status: 'pending',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: 'CRIIS-006',
      asset_name: 'Radar Unit 01',
      job_no: 'MX-2024-002',
      priority: 'urgent',
      pgm_id: 1,
      notes: 'Required for NMCS asset - radar power supply failure',
      shipping_tracking: null,
      estimated_delivery: null,
    },
    {
      order_id: 2,
      part_no: 'PN-FLT-002',
      part_name: 'Air Filter Assembly',
      nsn: '2940-01-333-5678',
      qty_ordered: 5,
      qty_received: 0,
      unit_price: 89.50,
      order_date: addDays(-1),
      status: 'pending',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: null,
      asset_name: null,
      job_no: null,
      priority: 'routine',
      pgm_id: 1,
      notes: 'Stock replenishment',
      shipping_tracking: null,
      estimated_delivery: null,
    },
    // Acknowledged orders (being processed) - CRIIS
    {
      order_id: 3,
      part_no: 'PN-DIODE-003',
      part_name: 'Laser Diode Module',
      nsn: '5960-01-444-9876',
      qty_ordered: 1,
      qty_received: 0,
      unit_price: 4500.00,
      order_date: addDays(-7),
      status: 'acknowledged',
      requestor_id: 2,
      requestor_name: 'Jane Depot',
      asset_sn: 'ACTS-005',
      asset_name: 'Laser System',
      job_no: 'MX-2024-006',
      priority: 'critical',
      pgm_id: 2,
      notes: 'Critical NMCS item - laser diode replacement for targeting system',
      shipping_tracking: null,
      estimated_delivery: addDays(5),
    },
    {
      order_id: 4,
      part_no: 'PN-CAB-004',
      part_name: 'Coaxial Cable Assembly',
      nsn: '6145-01-222-4567',
      qty_ordered: 10,
      qty_received: 0,
      unit_price: 45.00,
      order_date: addDays(-5),
      status: 'acknowledged',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: null,
      asset_name: null,
      job_no: null,
      priority: 'routine',
      pgm_id: 1,
      notes: 'Stock replenishment for field operations',
      shipping_tracking: null,
      estimated_delivery: addDays(10),
    },
    // Shipped orders - CRIIS
    {
      order_id: 5,
      part_no: 'PN-LENS-005',
      part_name: 'Optical Lens Kit',
      nsn: '6650-01-111-2345',
      qty_ordered: 1,
      qty_received: 0,
      unit_price: 2800.00,
      order_date: addDays(-10),
      status: 'shipped',
      requestor_id: 2,
      requestor_name: 'Jane Depot',
      asset_sn: 'ARDS-004',
      asset_name: 'Reconnaissance Camera',
      job_no: 'MX-2024-007',
      priority: 'urgent',
      pgm_id: 3,
      notes: 'Replacement optics for camera recalibration',
      shipping_tracking: 'FDX-2024-123456789',
      estimated_delivery: addDays(2),
    },
    // More pending orders - ACTS
    {
      order_id: 6,
      part_no: 'PN-GYRO-006',
      part_name: 'Gyroscope Stabilizer',
      nsn: '6615-01-777-8901',
      qty_ordered: 1,
      qty_received: 0,
      unit_price: 3200.00,
      order_date: addDays(-2),
      status: 'pending',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: 'ACTS-003',
      asset_name: 'Targeting System B',
      job_no: 'MX-2024-005',
      priority: 'critical',
      pgm_id: 2,
      notes: 'Required for optical alignment issue fix',
      shipping_tracking: null,
      estimated_delivery: null,
    },
    // Acknowledged - Program 236
    {
      order_id: 7,
      part_no: 'PN-CLASS-007',
      part_name: 'Classified Component Alpha',
      nsn: '5999-01-999-0001',
      qty_ordered: 1,
      qty_received: 0,
      unit_price: 15000.00,
      order_date: addDays(-8),
      status: 'acknowledged',
      requestor_id: 2,
      requestor_name: 'Jane Depot',
      asset_sn: '236-002',
      asset_name: 'Special Unit 001',
      job_no: 'MX-2024-010',
      priority: 'urgent',
      pgm_id: 4,
      notes: 'Classified component - special handling required',
      shipping_tracking: null,
      estimated_delivery: addDays(14),
    },
    // Received orders (for history)
    {
      order_id: 8,
      part_no: 'PN-SEAL-008',
      part_name: 'O-Ring Seal Kit',
      nsn: '5330-01-666-3456',
      qty_ordered: 20,
      qty_received: 20,
      unit_price: 12.50,
      order_date: addDays(-15),
      status: 'received',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: null,
      asset_name: null,
      job_no: null,
      priority: 'routine',
      pgm_id: 1,
      notes: 'Stock replenishment - received complete',
      shipping_tracking: 'UPS-2024-987654321',
      estimated_delivery: addDays(-5),
    },
    // More pending items for CRIIS
    {
      order_id: 9,
      part_no: 'PN-BATT-009',
      part_name: 'Lithium Battery Pack',
      nsn: '6140-01-888-7654',
      qty_ordered: 4,
      qty_received: 0,
      unit_price: 650.00,
      order_date: addDays(-1),
      status: 'pending',
      requestor_id: 3,
      requestor_name: 'Bob Field',
      asset_sn: 'CRIIS-005',
      asset_name: 'Camera System X',
      job_no: 'MX-2024-001',
      priority: 'urgent',
      pgm_id: 1,
      notes: 'Battery replacement for intermittent power issue',
      shipping_tracking: null,
      estimated_delivery: null,
    },
  ];
}

// Dashboard: Get parts awaiting action (requires authentication)
app.get('/api/dashboard/parts-awaiting-action', (req, res) => {
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

  // Generate parts orders
  const allOrders = generateMockPartsOrders();

  // Filter by user's accessible programs and only show pending/acknowledged items
  let filteredOrders = allOrders.filter(
    order => (order.status === 'pending' || order.status === 'acknowledged') && userProgramIds.includes(order.pgm_id)
  );

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredOrders = filteredOrders.filter(order => order.pgm_id === programIdFilter);
  }

  // Sort by priority (critical first, then urgent, then routine)
  const priorityOrder: Record<string, number> = { critical: 0, urgent: 1, routine: 2 };
  filteredOrders.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Calculate summary counts
  const summary = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    acknowledged: filteredOrders.filter(o => o.status === 'acknowledged').length,
    critical: filteredOrders.filter(o => o.priority === 'critical').length,
    urgent: filteredOrders.filter(o => o.priority === 'urgent').length,
    routine: filteredOrders.filter(o => o.priority === 'routine').length,
    total: filteredOrders.length,
  };

  console.log(`[PARTS] Awaiting action request by ${user.username} - Total: ${summary.total}, Pending: ${summary.pending}, Acknowledged: ${summary.acknowledged}`);

  res.json({
    orders: filteredOrders,
    summary,
  });
});

// Mock Activity Log data for recent activity feed
interface ActivityLogEntry {
  activity_id: number;
  timestamp: string;
  user_id: number;
  username: string;
  user_full_name: string;
  action_type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'status_change' | 'order' | 'complete';
  entity_type: 'asset' | 'maintenance' | 'pmi' | 'parts_order' | 'user' | 'session' | 'tcto';
  entity_id: number | null;
  entity_name: string | null;
  description: string;
  pgm_id: number | null;
}

// Generate mock activity log data with realistic timestamps
function generateMockActivityLog(): ActivityLogEntry[] {
  const now = new Date();

  // Helper to create timestamp strings with relative time
  const subtractMinutes = (minutes: number): string => {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - minutes);
    return date.toISOString();
  };

  return [
    {
      activity_id: 1,
      timestamp: subtractMinutes(5),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'create',
      entity_type: 'maintenance',
      entity_id: 11,
      entity_name: 'MX-2024-011',
      description: 'Created maintenance job MX-2024-011 for Sensor Unit A',
      pgm_id: 1,
    },
    {
      activity_id: 2,
      timestamp: subtractMinutes(12),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'status_change',
      entity_type: 'parts_order',
      entity_id: 3,
      entity_name: 'PN-DIODE-003',
      description: 'Acknowledged parts order for Laser Diode Module',
      pgm_id: 2,
    },
    {
      activity_id: 3,
      timestamp: subtractMinutes(25),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'order',
      entity_type: 'parts_order',
      entity_id: 9,
      entity_name: 'PN-BATT-009',
      description: 'Ordered 4x Lithium Battery Pack for Camera System X',
      pgm_id: 1,
    },
    {
      activity_id: 4,
      timestamp: subtractMinutes(45),
      user_id: 1,
      username: 'admin',
      user_full_name: 'John Admin',
      action_type: 'update',
      entity_type: 'user',
      entity_id: 5,
      entity_name: 'test_user',
      description: 'Updated user account test_user - changed role to VIEWER',
      pgm_id: null,
    },
    {
      activity_id: 5,
      timestamp: subtractMinutes(60),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'complete',
      entity_type: 'pmi',
      entity_id: 12,
      entity_name: 'PMI-30DAY',
      description: 'Completed 30-Day Inspection on Sensor Unit A (CRIIS-001)',
      pgm_id: 1,
    },
    {
      activity_id: 6,
      timestamp: subtractMinutes(90),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'update',
      entity_type: 'maintenance',
      entity_id: 2,
      entity_name: 'MX-2024-002',
      description: 'Updated maintenance job MX-2024-002 - added repair notes',
      pgm_id: 1,
    },
    {
      activity_id: 7,
      timestamp: subtractMinutes(120),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'status_change',
      entity_type: 'asset',
      entity_id: 5,
      entity_name: 'CRIIS-005',
      description: 'Changed asset status from FMC to NMCM - Camera System X',
      pgm_id: 1,
    },
    {
      activity_id: 8,
      timestamp: subtractMinutes(180),
      user_id: 1,
      username: 'admin',
      user_full_name: 'John Admin',
      action_type: 'create',
      entity_type: 'user',
      entity_id: 6,
      entity_name: 'new_technician',
      description: 'Created new user account new_technician with role FIELD_TECHNICIAN',
      pgm_id: null,
    },
    {
      activity_id: 9,
      timestamp: subtractMinutes(240),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'create',
      entity_type: 'maintenance',
      entity_id: 1,
      entity_name: 'MX-2024-001',
      description: 'Created maintenance job MX-2024-001 - intermittent power failure',
      pgm_id: 1,
    },
    {
      activity_id: 10,
      timestamp: subtractMinutes(300),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'status_change',
      entity_type: 'parts_order',
      entity_id: 5,
      entity_name: 'PN-LENS-005',
      description: 'Shipped parts order - Optical Lens Kit (FDX-2024-123456789)',
      pgm_id: 3,
    },
    {
      activity_id: 11,
      timestamp: subtractMinutes(360),
      user_id: 1,
      username: 'admin',
      user_full_name: 'John Admin',
      action_type: 'update',
      entity_type: 'tcto',
      entity_id: 1,
      entity_name: 'TCTO-2024-15',
      description: 'Updated TCTO-2024-15 compliance deadline to 2024-03-15',
      pgm_id: 1,
    },
    {
      activity_id: 12,
      timestamp: subtractMinutes(420),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'order',
      entity_type: 'parts_order',
      entity_id: 1,
      entity_name: 'PN-PSU-001',
      description: 'Ordered 2x Power Supply Unit 24V for Radar Unit 01',
      pgm_id: 1,
    },
    {
      activity_id: 13,
      timestamp: subtractMinutes(500),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'complete',
      entity_type: 'maintenance',
      entity_id: 8,
      entity_name: 'MX-2024-008',
      description: 'Closed maintenance job MX-2024-008 - 30-day inspection completed',
      pgm_id: 1,
    },
    {
      activity_id: 14,
      timestamp: subtractMinutes(600),
      user_id: 1,
      username: 'admin',
      user_full_name: 'John Admin',
      action_type: 'login',
      entity_type: 'session',
      entity_id: null,
      entity_name: null,
      description: 'User logged in from 192.168.1.100',
      pgm_id: null,
    },
    {
      activity_id: 15,
      timestamp: subtractMinutes(720),
      user_id: 3,
      username: 'field_tech',
      user_full_name: 'Bob Field',
      action_type: 'status_change',
      entity_type: 'asset',
      entity_id: 6,
      entity_name: 'CRIIS-006',
      description: 'Changed asset status from PMC to NMCS - Radar Unit 01',
      pgm_id: 1,
    },
  ];
}

// Mutable activity log to store new activities (e.g., from asset updates)
const dynamicActivityLog: ActivityLogEntry[] = [];

// Dashboard: Get recent activity (requires authentication)
app.get('/api/dashboard/recent-activity', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get optional limit from query string (default to 10)
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  // Generate activity log (static + dynamic entries)
  const allActivity = [...generateMockActivityLog(), ...dynamicActivityLog];

  // Filter activity by user's accessible programs (null pgm_id entries are global and visible to all)
  const filteredActivity = allActivity.filter(
    activity => activity.pgm_id === null || userProgramIds.includes(activity.pgm_id)
  );

  // Sort by timestamp (most recent first) and limit
  const sortedActivity = filteredActivity
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  console.log(`[ACTIVITY] Recent activity request by ${user.username} - Returned: ${sortedActivity.length} entries`);

  res.json({
    activities: sortedActivity,
    total: sortedActivity.length,
  });
});

// Enhanced mock asset data with more details for the Assets page
interface AssetDetails {
  asset_id: number;
  serno: string;
  partno: string;
  part_name: string;
  pgm_id: number;
  status_cd: string;
  status_name: string;
  active: boolean;
  location: string;
  loc_type: 'depot' | 'field';
  in_transit: boolean;
  bad_actor: boolean;
  last_maint_date: string | null;
  next_pmi_date: string | null;
  eti_hours: number | null;
  remarks: string | null;
}

// Generate detailed asset data - initialize once and make mutable
function initializeDetailedAssets(): AssetDetails[] {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };
  const subtractDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  return [
    // CRIIS program assets (pgm_id: 1)
    { asset_id: 1, serno: 'CRIIS-001', partno: 'PN-SENSOR-A', part_name: 'Sensor Unit A', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(15), next_pmi_date: addDays(45), eti_hours: 1250, remarks: null },
    { asset_id: 2, serno: 'CRIIS-002', partno: 'PN-SENSOR-A', part_name: 'Sensor Unit A', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(30), next_pmi_date: addDays(30), eti_hours: 980, remarks: null },
    { asset_id: 3, serno: 'CRIIS-003', partno: 'PN-SENSOR-B', part_name: 'Sensor Unit B', pgm_id: 1, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(5), next_pmi_date: addDays(85), eti_hours: 2100, remarks: 'Awaiting software update' },
    { asset_id: 4, serno: 'CRIIS-004', partno: 'PN-CAMERA-X', part_name: 'Camera System X', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Charlie', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(60), next_pmi_date: addDays(120), eti_hours: 450, remarks: null },
    { asset_id: 5, serno: 'CRIIS-005', partno: 'PN-CAMERA-X', part_name: 'Camera System X', pgm_id: 1, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: true, last_maint_date: subtractDays(5), next_pmi_date: null, eti_hours: 3200, remarks: 'Intermittent power failure - MX-2024-001' },
    { asset_id: 6, serno: 'CRIIS-006', partno: 'PN-RADAR-01', part_name: 'Radar Unit 01', pgm_id: 1, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(10), next_pmi_date: null, eti_hours: 1800, remarks: 'Awaiting power supply - MX-2024-002' },
    { asset_id: 7, serno: 'CRIIS-007', partno: 'PN-RADAR-01', part_name: 'Radar Unit 01', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(45), next_pmi_date: addDays(15), eti_hours: 2500, remarks: null },
    { asset_id: 8, serno: 'CRIIS-008', partno: 'PN-COMM-SYS', part_name: 'Communication System', pgm_id: 1, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Field Site Charlie', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(1), next_pmi_date: addDays(60), eti_hours: 890, remarks: 'TCTO-2024-15 pending' },
    { asset_id: 9, serno: 'CRIIS-009', partno: 'PN-COMM-SYS', part_name: 'Communication System', pgm_id: 1, status_cd: 'CNDM', status_name: 'Cannot Determine Mission', active: true, location: 'In Transit', loc_type: 'depot', in_transit: true, bad_actor: false, last_maint_date: subtractDays(90), next_pmi_date: null, eti_hours: null, remarks: 'En route from vendor repair' },
    { asset_id: 10, serno: 'CRIIS-010', partno: 'PN-NAV-UNIT', part_name: 'Navigation Unit', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(20), next_pmi_date: addDays(70), eti_hours: 1100, remarks: null },

    // ACTS program assets (pgm_id: 2)
    { asset_id: 11, serno: 'ACTS-001', partno: 'PN-TARGET-A', part_name: 'Targeting System A', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(18), next_pmi_date: addDays(90), eti_hours: 750, remarks: null },
    { asset_id: 12, serno: 'ACTS-002', partno: 'PN-TARGET-A', part_name: 'Targeting System A', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(25), next_pmi_date: addDays(65), eti_hours: 920, remarks: null },
    { asset_id: 13, serno: 'ACTS-003', partno: 'PN-TARGET-B', part_name: 'Targeting System B', pgm_id: 2, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(3), next_pmi_date: null, eti_hours: 2800, remarks: 'Optical alignment issue - MX-2024-005' },
    { asset_id: 14, serno: 'ACTS-004', partno: 'PN-LASER-SYS', part_name: 'Laser Designator', pgm_id: 2, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(12), next_pmi_date: addDays(28), eti_hours: 1500, remarks: 'Range limited to 5km' },
    { asset_id: 15, serno: 'ACTS-005', partno: 'PN-LASER-SYS', part_name: 'Laser Designator', pgm_id: 2, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(7), next_pmi_date: null, eti_hours: 3100, remarks: 'Awaiting laser diode - MX-2024-006' },
    { asset_id: 16, serno: 'ACTS-006', partno: 'PN-OPTICS-01', part_name: 'Optical Sight Unit', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(40), next_pmi_date: addDays(50), eti_hours: 680, remarks: null },

    // ARDS program assets (pgm_id: 3)
    { asset_id: 17, serno: 'ARDS-001', partno: 'PN-DATA-SYS', part_name: 'Data Processor', pgm_id: 3, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(22), next_pmi_date: addDays(68), eti_hours: 1400, remarks: null },
    { asset_id: 18, serno: 'ARDS-002', partno: 'PN-DATA-SYS', part_name: 'Data Processor', pgm_id: 3, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Echo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(35), next_pmi_date: addDays(55), eti_hours: 1650, remarks: null },
    { asset_id: 19, serno: 'ARDS-003', partno: 'PN-RECON-CAM', part_name: 'Reconnaissance Camera', pgm_id: 3, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(8), next_pmi_date: addDays(22), eti_hours: 2200, remarks: 'IR channel degraded' },
    { asset_id: 20, serno: 'ARDS-004', partno: 'PN-RECON-CAM', part_name: 'Reconnaissance Camera', pgm_id: 3, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(1), next_pmi_date: null, eti_hours: 2900, remarks: 'Lens recalibration - MX-2024-007' },
    { asset_id: 21, serno: 'ARDS-005', partno: 'PN-LINK-SYS', part_name: 'Data Link System', pgm_id: 3, status_cd: 'CNDM', status_name: 'Cannot Determine Mission', active: true, location: 'In Transit', loc_type: 'depot', in_transit: true, bad_actor: false, last_maint_date: subtractDays(100), next_pmi_date: null, eti_hours: null, remarks: 'Returning from depot repair' },

    // Program 236 assets (pgm_id: 4)
    { asset_id: 22, serno: '236-001', partno: 'PN-SPEC-001', part_name: 'Special System Alpha', pgm_id: 4, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(14), next_pmi_date: addDays(76), eti_hours: 560, remarks: null },
    { asset_id: 23, serno: '236-002', partno: 'PN-SPEC-001', part_name: 'Special System Alpha', pgm_id: 4, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(4), next_pmi_date: null, eti_hours: 1200, remarks: 'Awaiting classified component - MX-2024-010' },
    { asset_id: 24, serno: '236-003', partno: 'PN-SPEC-002', part_name: 'Special System Beta', pgm_id: 4, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(28), next_pmi_date: addDays(32), eti_hours: 890, remarks: 'Mode 3 limited' },
    { asset_id: 25, serno: '236-004', partno: 'PN-SPEC-003', part_name: 'Special System Gamma', pgm_id: 4, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(50), next_pmi_date: addDays(40), eti_hours: 340, remarks: null },
  ];
}

// Mutable array of detailed assets - initialized once, persists modifications
const detailedAssets: AssetDetails[] = initializeDetailedAssets();

// GET /api/assets - List all assets for a program (requires authentication)
app.get('/api/assets', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get program filter from query string (required or use default)
  let programIdFilter = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;

  // If no program specified, use user's default program
  if (!programIdFilter) {
    const defaultProgram = user.programs.find(p => p.is_default);
    programIdFilter = defaultProgram?.pgm_id || user.programs[0]?.pgm_id || 1;
  }

  // Check if user has access to this program
  if (!userProgramIds.includes(programIdFilter) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this program' });
  }

  // Get detailed assets
  const allAssets = generateDetailedAssets();

  // Filter by program
  let filteredAssets = allAssets.filter(asset => asset.pgm_id === programIdFilter);

  // Apply optional status filter
  const statusFilter = req.query.status as string;
  if (statusFilter) {
    filteredAssets = filteredAssets.filter(asset => asset.status_cd === statusFilter);
  }

  // Apply optional search filter (searches serno, partno, part_name)
  const searchQuery = (req.query.search as string)?.toLowerCase();
  if (searchQuery) {
    filteredAssets = filteredAssets.filter(asset =>
      asset.serno.toLowerCase().includes(searchQuery) ||
      asset.partno.toLowerCase().includes(searchQuery) ||
      asset.part_name.toLowerCase().includes(searchQuery)
    );
  }

  // Get pagination params
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 25, 100);
  const offset = (page - 1) * limit;

  // Calculate total before pagination
  const total = filteredAssets.length;

  // Apply pagination
  const paginatedAssets = filteredAssets.slice(offset, offset + limit);

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === programIdFilter);

  console.log(`[ASSETS] List request by ${user.username} - Program: ${program?.pgm_cd}, Total: ${total}, Page: ${page}`);

  res.json({
    assets: paginatedAssets,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
    program: {
      pgm_id: programIdFilter,
      pgm_cd: program?.pgm_cd || 'UNKNOWN',
      pgm_name: program?.pgm_name || 'Unknown Program',
    },
  });
});

// GET /api/assets/:id - Get single asset by ID (requires authentication)
app.get('/api/assets/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);

  // Get the raw asset from mockAssets for editable fields
  const rawAsset = mockAssets.find(a => a.asset_id === assetId);

  if (!rawAsset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(rawAsset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get program and location info for display
  const program = allPrograms.find(p => p.pgm_id === rawAsset.pgm_id);
  const adminLocInfo = adminLocations.find(l => l.loc_cd === rawAsset.admin_loc);
  const custLocInfo = custodialLocations.find(l => l.loc_cd === rawAsset.cust_loc);
  const statusInfo = assetStatusCodes.find(s => s.status_cd === rawAsset.status_cd);

  res.json({
    asset: {
      ...rawAsset,
      status_name: statusInfo?.status_name || rawAsset.status_cd,
      admin_loc_name: adminLocInfo?.loc_name || rawAsset.admin_loc,
      cust_loc_name: custLocInfo?.loc_name || rawAsset.cust_loc,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    }
  });
});

// PUT /api/assets/:id - Update an existing asset (requires authentication and depot_manager/admin role)
app.put('/api/assets/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role - only ADMIN and DEPOT_MANAGER can update assets
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'You do not have permission to modify assets' });
  }

  const assetId = parseInt(req.params.id, 10);
  const assetIndex = mockAssets.findIndex(a => a.asset_id === assetId);

  if (assetIndex === -1) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  const asset = mockAssets[assetIndex];

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  const { partno, serno, name, status_cd, admin_loc, cust_loc, notes, active } = req.body;

  // Track changes for audit log
  const changes: string[] = [];
  const oldAsset = { ...asset };

  // Validate and apply changes
  if (partno !== undefined && partno !== asset.partno) {
    if (!partno) {
      return res.status(400).json({ error: 'Part number cannot be empty' });
    }
    changes.push(`Part Number: ${asset.partno} → ${partno}`);
    asset.partno = partno;
  }

  if (serno !== undefined && serno !== asset.serno) {
    if (!serno) {
      return res.status(400).json({ error: 'Serial number cannot be empty' });
    }
    // Check for duplicate serial number (within same program)
    const existingAsset = mockAssets.find(a => a.serno.toLowerCase() === serno.toLowerCase() && a.pgm_id === asset.pgm_id && a.asset_id !== assetId);
    if (existingAsset) {
      return res.status(400).json({ error: 'An asset with this serial number already exists in this program' });
    }
    changes.push(`Serial Number: ${asset.serno} → ${serno}`);
    asset.serno = serno;
  }

  if (name !== undefined && name !== asset.name) {
    changes.push(`Name: ${asset.name} → ${name}`);
    asset.name = name || `${asset.partno} - ${asset.serno}`;
  }

  if (status_cd !== undefined && status_cd !== asset.status_cd) {
    const validStatuses = assetStatusCodes.map(s => s.status_cd);
    if (!validStatuses.includes(status_cd)) {
      return res.status(400).json({ error: 'Invalid status code' });
    }
    const oldStatus = assetStatusCodes.find(s => s.status_cd === asset.status_cd);
    const newStatus = assetStatusCodes.find(s => s.status_cd === status_cd);
    changes.push(`Status: ${oldStatus?.status_name || asset.status_cd} → ${newStatus?.status_name || status_cd}`);
    asset.status_cd = status_cd;
  }

  if (admin_loc !== undefined && admin_loc !== asset.admin_loc) {
    const validAdminLocs = adminLocations.map(l => l.loc_cd);
    if (!validAdminLocs.includes(admin_loc)) {
      return res.status(400).json({ error: 'Invalid administrative location' });
    }
    const oldLoc = adminLocations.find(l => l.loc_cd === asset.admin_loc);
    const newLoc = adminLocations.find(l => l.loc_cd === admin_loc);
    changes.push(`Admin Location: ${oldLoc?.loc_name || asset.admin_loc} → ${newLoc?.loc_name || admin_loc}`);
    asset.admin_loc = admin_loc;
  }

  if (cust_loc !== undefined && cust_loc !== asset.cust_loc) {
    const validCustLocs = custodialLocations.map(l => l.loc_cd);
    if (!validCustLocs.includes(cust_loc)) {
      return res.status(400).json({ error: 'Invalid custodial location' });
    }
    const oldLoc = custodialLocations.find(l => l.loc_cd === asset.cust_loc);
    const newLoc = custodialLocations.find(l => l.loc_cd === cust_loc);
    changes.push(`Custodial Location: ${oldLoc?.loc_name || asset.cust_loc} → ${newLoc?.loc_name || cust_loc}`);
    asset.cust_loc = cust_loc;
  }

  if (notes !== undefined && notes !== asset.notes) {
    changes.push(`Notes: "${asset.notes || '(empty)'}" → "${notes || '(empty)'}"`);
    asset.notes = notes;
  }

  if (active !== undefined && active !== asset.active) {
    changes.push(`Active: ${asset.active ? 'Yes' : 'No'} → ${active ? 'Yes' : 'No'}`);
    asset.active = active;
  }

  if (changes.length === 0) {
    return res.status(400).json({ error: 'No changes provided' });
  }

  // Get program and location info for response
  const program = allPrograms.find(p => p.pgm_id === asset.pgm_id);
  const adminLocInfo = adminLocations.find(l => l.loc_cd === asset.admin_loc);
  const custLocInfo = custodialLocations.find(l => l.loc_cd === asset.cust_loc);
  const statusInfo = assetStatusCodes.find(s => s.status_cd === asset.status_cd);

  // Log the update
  console.log(`[ASSETS] Asset updated by ${user.username}: ${asset.serno} (ID: ${assetId})`);
  console.log(`[ASSETS] Changes: ${changes.join(', ')}`);

  // Add to activity log (audit trail)
  const now = new Date();
  const newActivity: ActivityLogEntry = {
    activity_id: 1000 + dynamicActivityLog.length + 1,
    timestamp: now.toISOString(),
    user_id: user.user_id,
    username: user.username,
    user_full_name: `${user.first_name} ${user.last_name}`,
    action_type: 'update',
    entity_type: 'asset',
    entity_id: assetId,
    entity_name: asset.serno,
    description: `Updated asset ${asset.serno}: ${changes.join('; ')}`,
    pgm_id: asset.pgm_id,
  };
  dynamicActivityLog.push(newActivity);

  res.json({
    message: 'Asset updated successfully',
    asset: {
      ...asset,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
      admin_loc_name: adminLocInfo?.loc_name || asset.admin_loc,
      cust_loc_name: custLocInfo?.loc_name || asset.cust_loc,
      status_name: statusInfo?.status_name || asset.status_cd,
    },
    changes,
    audit: newActivity,
  });
});

// POST /api/assets - Create a new asset (requires authentication and depot_manager/admin role)
app.post('/api/assets', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role - only ADMIN and DEPOT_MANAGER can create assets
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'You do not have permission to create assets' });
  }

  const { partno, serno, name, status_cd, admin_loc, cust_loc, notes, pgm_id } = req.body;

  // Validate required fields
  if (!partno || !serno || !status_cd || !admin_loc || !cust_loc || !pgm_id) {
    return res.status(400).json({ error: 'Part number, serial number, status, administrative location, custodial location, and program are required' });
  }

  // Check if user has access to this program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this program' });
  }

  // Validate status code
  const validStatuses = assetStatusCodes.map(s => s.status_cd);
  if (!validStatuses.includes(status_cd)) {
    return res.status(400).json({ error: 'Invalid status code' });
  }

  // Validate admin location
  const validAdminLocs = adminLocations.map(l => l.loc_cd);
  if (!validAdminLocs.includes(admin_loc)) {
    return res.status(400).json({ error: 'Invalid administrative location' });
  }

  // Validate custodial location
  const validCustLocs = custodialLocations.map(l => l.loc_cd);
  if (!validCustLocs.includes(cust_loc)) {
    return res.status(400).json({ error: 'Invalid custodial location' });
  }

  // Check for duplicate serial number (within same program)
  const existingAsset = mockAssets.find(a => a.serno.toLowerCase() === serno.toLowerCase() && a.pgm_id === pgm_id);
  if (existingAsset) {
    return res.status(400).json({ error: 'An asset with this serial number already exists in this program' });
  }

  // Generate new asset ID
  const newAssetId = Math.max(...mockAssets.map(a => a.asset_id)) + 1;

  // Create the new asset
  const newAsset: Asset = {
    asset_id: newAssetId,
    serno,
    partno,
    name: name || `${partno} - ${serno}`,
    pgm_id,
    status_cd,
    admin_loc,
    cust_loc,
    notes: notes || '',
    active: true,
    created_date: new Date().toISOString().split('T')[0],
  };

  // Add to mock data array
  mockAssets.push(newAsset);

  // Get program and location info for response
  const program = allPrograms.find(p => p.pgm_id === pgm_id);
  const adminLocInfo = adminLocations.find(l => l.loc_cd === admin_loc);
  const custLocInfo = custodialLocations.find(l => l.loc_cd === cust_loc);
  const statusInfo = assetStatusCodes.find(s => s.status_cd === status_cd);

  console.log(`[ASSETS] New asset created by ${user.username}: ${serno} (ID: ${newAssetId}, Program: ${program?.pgm_cd})`);

  res.status(201).json({
    message: 'Asset created successfully',
    asset: {
      ...newAsset,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
      admin_loc_name: adminLocInfo?.loc_name || admin_loc,
      cust_loc_name: custLocInfo?.loc_name || cust_loc,
      status_name: statusInfo?.status_name || status_cd,
    }
  });
});

// DELETE /api/assets/:id - Delete an asset (requires authentication and admin role)
app.delete('/api/assets/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role - only ADMIN can delete assets
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only administrators can delete assets' });
  }

  const assetId = parseInt(req.params.id, 10);
  const assetIndex = mockAssets.findIndex(a => a.asset_id === assetId);

  if (assetIndex === -1) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  const asset = mockAssets[assetIndex];

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Store asset info before deletion for logging
  const deletedAssetInfo = {
    asset_id: asset.asset_id,
    serno: asset.serno,
    partno: asset.partno,
    name: asset.name,
    pgm_id: asset.pgm_id,
  };

  // Remove the asset from the array
  mockAssets.splice(assetIndex, 1);

  // Log the deletion
  console.log(`[ASSETS] Asset deleted by ${user.username}: ${deletedAssetInfo.serno} (ID: ${assetId})`);

  // Add to activity log (audit trail)
  const now = new Date();
  const newActivity: ActivityLogEntry = {
    activity_id: 1000 + dynamicActivityLog.length + 1,
    timestamp: now.toISOString(),
    user_id: user.user_id,
    username: user.username,
    user_full_name: `${user.first_name} ${user.last_name}`,
    action_type: 'delete',
    entity_type: 'asset',
    entity_id: assetId,
    entity_name: deletedAssetInfo.serno,
    description: `Deleted asset ${deletedAssetInfo.serno} (${deletedAssetInfo.name})`,
    pgm_id: deletedAssetInfo.pgm_id,
  };
  dynamicActivityLog.push(newActivity);

  res.json({
    message: `Asset "${deletedAssetInfo.serno}" deleted successfully`,
    deleted_asset: deletedAssetInfo,
    audit: newActivity,
  });
});

// GET /api/reference/locations - Get available locations for asset forms
app.get('/api/reference/locations', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  res.json({
    admin_locations: adminLocations,
    custodial_locations: custodialLocations,
  });
});

// GET /api/reference/asset-statuses - Get available asset status codes
app.get('/api/reference/asset-statuses', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  res.json({
    statuses: assetStatusCodes,
  });
});

// Get single parts order by ID
app.get('/api/parts-orders/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const orderId = parseInt(req.params.id, 10);
  const allOrders = generateMockPartsOrders();
  const order = allOrders.find(o => o.order_id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Parts order not found' });
  }

  // Check if user has access to this order's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(order.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this parts order' });
  }

  // Add program info for display
  const program = allPrograms.find(p => p.pgm_id === order.pgm_id);

  res.json({
    order: {
      ...order,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    }
  });
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
