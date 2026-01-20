import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Load environment variables
dotenv.config()

// Configure uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR)
  },
  filename: (_req, file, cb) => {
    // Generate unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `attachment-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Allow common document and image types
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ]
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, images, Word, Excel, and text files are allowed.'))
    }
  }
})

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

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR))

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

// Status transition rules - defines which transitions are allowed
// Business rules:
// - FMC: Can transition to any status (asset can degrade or need maintenance)
// - PMC: Can transition to FMC (fixed), or degrade to NMCM/NMCS/CNDM
// - NMCM: Can transition to FMC (fully fixed), PMC (partially fixed), or NMCS (waiting for parts), CNDM
// - NMCS: Can transition to FMC (fixed), PMC (partially fixed), NMCM (parts arrived, now in maintenance), CNDM
// - CNDM: Cannot directly go to FMC or PMC (must go through maintenance - NMCM/NMCS first)
const statusTransitionRules: Record<string, string[]> = {
  'FMC': ['PMC', 'NMCM', 'NMCS', 'CNDM'],  // FMC can degrade to anything
  'PMC': ['FMC', 'NMCM', 'NMCS', 'CNDM'],  // PMC can improve to FMC or degrade further
  'NMCM': ['FMC', 'PMC', 'NMCS', 'CNDM'],  // NMCM can be fixed or transition to supply wait
  'NMCS': ['FMC', 'PMC', 'NMCM', 'CNDM'],  // NMCS can be fixed or transition to maintenance
  'CNDM': ['NMCM', 'NMCS'],  // CNDM must go through maintenance before becoming capable
}

// Function to validate status transitions
function isValidStatusTransition(fromStatus: string, toStatus: string): { valid: boolean; message?: string } {
  // Same status is always allowed (no change)
  if (fromStatus === toStatus) {
    return { valid: true };
  }

  const allowedTransitions = statusTransitionRules[fromStatus];

  if (!allowedTransitions) {
    return { valid: false, message: `Unknown current status: ${fromStatus}` };
  }

  if (!allowedTransitions.includes(toStatus)) {
    const fromName = assetStatusCodes.find(s => s.status_cd === fromStatus)?.status_name || fromStatus;
    const toName = assetStatusCodes.find(s => s.status_cd === toStatus)?.status_name || toStatus;

    // Provide specific guidance for CNDM restrictions
    if (fromStatus === 'CNDM' && (toStatus === 'FMC' || toStatus === 'PMC')) {
      return {
        valid: false,
        message: `Invalid status transition: Cannot change directly from ${fromName} to ${toName}. Assets with undetermined status must first be placed in maintenance (NMCM) or supply wait (NMCS) before becoming mission capable.`
      };
    }

    return {
      valid: false,
      message: `Invalid status transition: Cannot change from ${fromName} to ${toName}. Allowed transitions from ${fromName}: ${allowedTransitions.map(s => assetStatusCodes.find(sc => sc.status_cd === s)?.status_name || s).join(', ')}.`
    };
  }

  return { valid: true };
}

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

// Asset History interface for detailed audit trail
interface AssetHistoryChange {
  field: string
  field_label: string
  old_value: string | null
  new_value: string | null
}

interface AssetHistoryEntry {
  history_id: number
  asset_id: number
  timestamp: string
  user_id: number
  username: string
  user_full_name: string
  action_type: 'create' | 'update' | 'delete'
  changes: AssetHistoryChange[]
  description: string
}

// Asset history storage - stores all history events for assets
const assetHistory: AssetHistoryEntry[] = []

// ETI (Elapsed Time Indicator) History interface and storage
interface ETIHistoryEntry {
  eti_history_id: number;
  asset_id: number;
  timestamp: string;
  user_id: number;
  username: string;
  user_full_name: string;
  old_eti_hours: number | null;
  new_eti_hours: number;
  hours_added: number;
  source: 'maintenance' | 'manual' | 'sortie';  // How ETI was updated
  source_id: number | null;  // ID of maintenance event, sortie, etc.
  source_ref: string | null;  // Reference like job number
  notes: string | null;
}

// ETI history storage
const etiHistory: ETIHistoryEntry[] = []

// Helper function to add ETI history entry
function addETIHistory(
  assetId: number,
  user: { user_id: number; username: string; first_name: string; last_name: string },
  oldETI: number | null,
  newETI: number,
  hoursAdded: number,
  source: 'maintenance' | 'manual' | 'sortie',
  sourceId: number | null,
  sourceRef: string | null,
  notes: string | null
): ETIHistoryEntry {
  const entry: ETIHistoryEntry = {
    eti_history_id: etiHistory.length + 1,
    asset_id: assetId,
    timestamp: new Date().toISOString(),
    user_id: user.user_id,
    username: user.username,
    user_full_name: `${user.first_name} ${user.last_name}`,
    old_eti_hours: oldETI,
    new_eti_hours: newETI,
    hours_added: hoursAdded,
    source,
    source_id: sourceId,
    source_ref: sourceRef,
    notes,
  };
  etiHistory.push(entry);
  return entry;
}

// Initialize some ETI history for existing assets (simulate past updates)
function initializeETIHistory(): void {
  const today = new Date();
  const subtractDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  // Sample ETI history entries for asset CRIIS-001 (asset_id: 1)
  etiHistory.push({
    eti_history_id: 1,
    asset_id: 1,
    timestamp: subtractDays(90),
    user_id: 2,
    username: 'depot_mgr',
    user_full_name: 'Jane Depot',
    old_eti_hours: 1100,
    new_eti_hours: 1200,
    hours_added: 100,
    source: 'sortie',
    source_id: null,
    source_ref: 'SORTIE-2024-045',
    notes: 'Post-mission ETI update'
  });
  etiHistory.push({
    eti_history_id: 2,
    asset_id: 1,
    timestamp: subtractDays(45),
    user_id: 2,
    username: 'depot_mgr',
    user_full_name: 'Jane Depot',
    old_eti_hours: 1200,
    new_eti_hours: 1250,
    hours_added: 50,
    source: 'maintenance',
    source_id: 8,
    source_ref: 'MX-2024-008',
    notes: 'ETI recorded during 30-day PMI'
  });

  // Sample ETI history for CRIIS-005 (asset_id: 5) - high ETI unit
  etiHistory.push({
    eti_history_id: 3,
    asset_id: 5,
    timestamp: subtractDays(120),
    user_id: 3,
    username: 'field_tech',
    user_full_name: 'Bob Technician',
    old_eti_hours: 2800,
    new_eti_hours: 3000,
    hours_added: 200,
    source: 'sortie',
    source_id: null,
    source_ref: 'SORTIE-2024-032',
    notes: 'Extended deployment mission'
  });
  etiHistory.push({
    eti_history_id: 4,
    asset_id: 5,
    timestamp: subtractDays(60),
    user_id: 2,
    username: 'depot_mgr',
    user_full_name: 'Jane Depot',
    old_eti_hours: 3000,
    new_eti_hours: 3150,
    hours_added: 150,
    source: 'manual',
    source_id: null,
    source_ref: null,
    notes: 'Corrected ETI after audit'
  });
  etiHistory.push({
    eti_history_id: 5,
    asset_id: 5,
    timestamp: subtractDays(10),
    user_id: 2,
    username: 'depot_mgr',
    user_full_name: 'Jane Depot',
    old_eti_hours: 3150,
    new_eti_hours: 3200,
    hours_added: 50,
    source: 'maintenance',
    source_id: 1,
    source_ref: 'MX-2024-001',
    notes: 'ETI recorded at start of maintenance'
  });
}

// Helper function to add asset history entry
function addAssetHistory(
  assetId: number,
  user: { user_id: number; username: string; first_name: string; last_name: string },
  actionType: 'create' | 'update' | 'delete',
  changes: AssetHistoryChange[],
  description: string
): AssetHistoryEntry {
  const entry: AssetHistoryEntry = {
    history_id: assetHistory.length + 1,
    asset_id: assetId,
    timestamp: new Date().toISOString(),
    user_id: user.user_id,
    username: user.username,
    user_full_name: `${user.first_name} ${user.last_name}`,
    action_type: actionType,
    changes,
    description,
  }
  assetHistory.push(entry)
  return entry
}

// Initialize history for existing assets (simulate creation events)
function initializeAssetHistory(): void {
  mockAssets.forEach(asset => {
    const createdDate = new Date(asset.created_date)
    createdDate.setHours(9, 0, 0, 0) // Set to 9 AM

    const entry: AssetHistoryEntry = {
      history_id: assetHistory.length + 1,
      asset_id: asset.asset_id,
      timestamp: createdDate.toISOString(),
      user_id: 1, // Admin created all initial assets
      username: 'admin',
      user_full_name: 'John Admin',
      action_type: 'create',
      changes: [
        { field: 'serno', field_label: 'Serial Number', old_value: null, new_value: asset.serno },
        { field: 'partno', field_label: 'Part Number', old_value: null, new_value: asset.partno },
        { field: 'name', field_label: 'Name', old_value: null, new_value: asset.name },
        { field: 'status_cd', field_label: 'Status', old_value: null, new_value: asset.status_cd },
        { field: 'admin_loc', field_label: 'Admin Location', old_value: null, new_value: asset.admin_loc },
        { field: 'cust_loc', field_label: 'Custodial Location', old_value: null, new_value: asset.cust_loc },
      ],
      description: `Asset ${asset.serno} created`,
    }
    assetHistory.push(entry)
  })

  // Add some sample edit history for a few assets to make it more realistic
  const sampleEdits: { asset_id: number; changes: AssetHistoryChange[]; description: string; daysAgo: number }[] = [
    {
      asset_id: 1,
      changes: [
        { field: 'status_cd', field_label: 'Status', old_value: 'PMC', new_value: 'FMC' },
        { field: 'notes', field_label: 'Notes', old_value: 'Awaiting calibration', new_value: 'Primary sensor unit' },
      ],
      description: 'Status updated from PMC to FMC after calibration',
      daysAgo: 30,
    },
    {
      asset_id: 3,
      changes: [
        { field: 'cust_loc', field_label: 'Custodial Location', old_value: 'STORAGE-A', new_value: 'AIRCRAFT-1' },
      ],
      description: 'Asset transferred to Aircraft 1',
      daysAgo: 15,
    },
    {
      asset_id: 5,
      changes: [
        { field: 'status_cd', field_label: 'Status', old_value: 'FMC', new_value: 'NMCM' },
        { field: 'notes', field_label: 'Notes', old_value: '', new_value: 'Intermittent power failure' },
      ],
      description: 'Asset marked NMCM due to intermittent power failure',
      daysAgo: 7,
    },
    {
      asset_id: 6,
      changes: [
        { field: 'status_cd', field_label: 'Status', old_value: 'NMCM', new_value: 'NMCS' },
        { field: 'notes', field_label: 'Notes', old_value: 'Awaiting parts', new_value: 'Awaiting power supply module' },
      ],
      description: 'Status changed to NMCS - awaiting power supply module',
      daysAgo: 5,
    },
  ]

  sampleEdits.forEach(edit => {
    const editDate = new Date()
    editDate.setDate(editDate.getDate() - edit.daysAgo)
    editDate.setHours(14, 30, 0, 0)

    const entry: AssetHistoryEntry = {
      history_id: assetHistory.length + 1,
      asset_id: edit.asset_id,
      timestamp: editDate.toISOString(),
      user_id: 2,
      username: 'depot_mgr',
      user_full_name: 'Jane Depot',
      action_type: 'update',
      changes: edit.changes,
      description: edit.description,
    }
    assetHistory.push(entry)
  })
}

// Initialize asset history on server start
initializeAssetHistory()

// Initialize ETI history on server start
initializeETIHistory()

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
  interval_days: number; // PMI interval in days (30, 60, 90, 180, 365)
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
    // Using real asset IDs from mockAssets
    {
      pmi_id: 1,
      asset_id: 1, // CRIIS-001 Sensor Unit A
      asset_sn: 'CRIIS-001',
      asset_name: 'Sensor Unit A',
      pmi_type: '30-Day Inspection',
      wuc_cd: '14AAA',
      next_due_date: addDays(-2), // Overdue by 2 days
      days_until_due: -2,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'overdue',
      interval_days: 30,
    },
    {
      pmi_id: 2,
      asset_id: 3, // CRIIS-003 Sensor Unit B
      asset_sn: 'CRIIS-003',
      asset_name: 'Sensor Unit B',
      pmi_type: '90-Day Calibration',
      wuc_cd: '23BBB',
      next_due_date: addDays(3), // Due in 3 days
      days_until_due: 3,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'due_soon',
      interval_days: 90,
    },
    {
      pmi_id: 3,
      asset_id: 4, // CRIIS-004 Camera System X
      asset_sn: 'CRIIS-004',
      asset_name: 'Camera System X',
      pmi_type: '60-Day Check',
      wuc_cd: '41CCC',
      next_due_date: addDays(7), // Due in 7 days (last red day)
      days_until_due: 7,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'due_soon',
      interval_days: 60,
    },
    // Yellow items - due in 8-30 days
    {
      pmi_id: 4,
      asset_id: 6, // CRIIS-006 Radar Unit 01
      asset_sn: 'CRIIS-006',
      asset_name: 'Radar Unit 01',
      pmi_type: '180-Day Service',
      wuc_cd: '74DDD',
      next_due_date: addDays(12), // Due in 12 days
      days_until_due: 12,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
      interval_days: 180,
    },
    {
      pmi_id: 5,
      asset_id: 8, // CRIIS-008 Communication System
      asset_sn: 'CRIIS-008',
      asset_name: 'Communication System',
      pmi_type: '365-Day Overhaul',
      wuc_cd: '62EEE',
      next_due_date: addDays(21), // Due in 21 days
      days_until_due: 21,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
      interval_days: 365,
    },
    {
      pmi_id: 6,
      asset_id: 11, // ACTS-001 Targeting System A
      asset_sn: 'ACTS-001',
      asset_name: 'Targeting System A',
      pmi_type: '30-Day Inspection',
      wuc_cd: '71FFF',
      next_due_date: addDays(28), // Due in 28 days
      days_until_due: 28,
      completed_date: null,
      pgm_id: 2, // ACTS
      status: 'upcoming',
      interval_days: 30,
    },
    // Green items - due after 30 days
    {
      pmi_id: 7,
      asset_id: 4, // CRIIS-004 Camera System X - second PMI for same asset
      asset_sn: 'CRIIS-004',
      asset_name: 'Camera System X',
      pmi_type: '90-Day Calibration',
      wuc_cd: '13GGG',
      next_due_date: addDays(45), // Due in 45 days
      days_until_due: 45,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
      interval_days: 90,
    },
    {
      pmi_id: 8,
      asset_id: 17, // ARDS-001 Data Processing System
      asset_sn: 'ARDS-001',
      asset_name: 'Data Processing System',
      pmi_type: '180-Day Service',
      wuc_cd: '25HHH',
      next_due_date: addDays(90), // Due in 90 days
      days_until_due: 90,
      completed_date: null,
      pgm_id: 3, // ARDS
      status: 'upcoming',
      interval_days: 180,
    },
    {
      pmi_id: 9,
      asset_id: 10, // CRIIS-010 Navigation Unit
      asset_sn: 'CRIIS-010',
      asset_name: 'Navigation Unit',
      pmi_type: '365-Day Overhaul',
      wuc_cd: '52III',
      next_due_date: addDays(120), // Due in 120 days
      days_until_due: 120,
      completed_date: null,
      pgm_id: 1, // CRIIS
      status: 'upcoming',
      interval_days: 365,
    },
    // Additional items for different programs
    {
      pmi_id: 10,
      asset_id: 14, // ACTS-004 Laser System
      asset_sn: 'ACTS-004',
      asset_name: 'Laser System',
      pmi_type: '60-Day Check',
      wuc_cd: '33JJJ',
      next_due_date: addDays(5), // Red - ACTS
      days_until_due: 5,
      completed_date: null,
      pgm_id: 2, // ACTS
      status: 'due_soon',
      interval_days: 60,
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

  // Get interval filter from query string (optional) - supports 30, 60, 90, 180, 365
  const intervalFilter = req.query.interval_days ? parseInt(req.query.interval_days as string, 10) : null;

  // Get search filter from query string (optional) - searches asset serial number and name
  const searchFilter = req.query.search ? (req.query.search as string).toLowerCase().trim() : null;

  // Get overdue_only filter from query string (optional) - shows only overdue PMIs
  const overdueOnlyFilter = req.query.overdue_only === 'true';

  // Generate fresh PMI data, including custom records and overrides
  const generatedPMI = generateMockPMIData();
  const customPMIIds = new Set(customPMIRecords.map(p => p.pmi_id));
  const filteredGeneratedPMI = generatedPMI.filter(p => !customPMIIds.has(p.pmi_id));
  const allPMI = [...filteredGeneratedPMI, ...customPMIRecords].map(pmi => {
    const daysUntilDue = calculateDaysUntilDue(pmi.next_due_date);
    return {
      ...pmi,
      days_until_due: daysUntilDue,
      status: pmi.completed_date ? 'completed' as const : getPMIStatus(daysUntilDue),
    };
  });

  // Filter PMI records by user's accessible programs
  let filteredPMI = allPMI.filter(pmi => userProgramIds.includes(pmi.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredPMI = filteredPMI.filter(pmi => pmi.pgm_id === programIdFilter);
  }

  // Apply interval filter if specified (30, 60, 90, 180, 365 days)
  if (intervalFilter && [30, 60, 90, 180, 365].includes(intervalFilter)) {
    filteredPMI = filteredPMI.filter(pmi => pmi.interval_days === intervalFilter);
  }

  // Apply search filter if specified (searches asset serial number and asset name)
  if (searchFilter) {
    filteredPMI = filteredPMI.filter(pmi =>
      pmi.asset_sn.toLowerCase().includes(searchFilter) ||
      pmi.asset_name.toLowerCase().includes(searchFilter) ||
      pmi.pmi_type.toLowerCase().includes(searchFilter)
    );
  }

  // Apply overdue only filter if specified
  if (overdueOnlyFilter) {
    filteredPMI = filteredPMI.filter(pmi => pmi.days_until_due < 0);
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

// Custom PMI records storage (for user-created PMIs)
let customPMIRecords: PMIRecord[] = [];
let nextCustomPMIId = 100; // Start custom IDs at 100 to avoid conflicts

// Get all PMI records (for PMI list page)
app.get('/api/pmi', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's accessible program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get program filter from query string (optional)
  const programIdFilter = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;

  // Get search filter from query string (optional) - searches asset serial number, name, and PMI type
  const searchFilter = req.query.search ? (req.query.search as string).toLowerCase().trim() : null;

  // Get overdue_only filter from query string (optional) - shows only overdue PMIs
  const overdueOnlyFilter = req.query.overdue_only === 'true';

  // Get interval filter from query string (optional) - supports 30, 60, 90, 180, 365
  const intervalFilter = req.query.interval_days ? parseInt(req.query.interval_days as string, 10) : null;

  // Get both generated and custom PMI data
  // Custom records may include overrides for generated PMIs, so we need to dedupe
  const generatedPMI = generateMockPMIData();
  const customPMIIds = new Set(customPMIRecords.map(p => p.pmi_id));
  // Filter out generated PMIs that have been overridden by custom records
  const filteredGeneratedPMI = generatedPMI.filter(p => !customPMIIds.has(p.pmi_id));
  const allPMI = [...filteredGeneratedPMI, ...customPMIRecords];

  // Filter PMI records by user's accessible programs
  let filteredPMI = allPMI.filter(pmi => userProgramIds.includes(pmi.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredPMI = filteredPMI.filter(pmi => pmi.pgm_id === programIdFilter);
  }

  // Update days_until_due and status dynamically
  filteredPMI = filteredPMI.map(pmi => {
    const daysUntilDue = calculateDaysUntilDue(pmi.next_due_date);
    return {
      ...pmi,
      days_until_due: daysUntilDue,
      status: pmi.completed_date ? 'completed' as const : getPMIStatus(daysUntilDue),
    };
  });

  // Apply search filter if specified (searches asset serial number, name, and PMI type)
  if (searchFilter) {
    filteredPMI = filteredPMI.filter(pmi =>
      pmi.asset_sn.toLowerCase().includes(searchFilter) ||
      pmi.asset_name.toLowerCase().includes(searchFilter) ||
      pmi.pmi_type.toLowerCase().includes(searchFilter)
    );
  }

  // Apply overdue only filter if specified
  if (overdueOnlyFilter) {
    filteredPMI = filteredPMI.filter(pmi => pmi.days_until_due < 0);
  }

  // Apply interval filter if specified (30, 60, 90, 180, 365 days)
  if (intervalFilter && [30, 60, 90, 180, 365].includes(intervalFilter)) {
    filteredPMI = filteredPMI.filter(pmi => pmi.interval_days === intervalFilter);
  }

  // Sort by days_until_due (most urgent first)
  filteredPMI.sort((a, b) => a.days_until_due - b.days_until_due);

  console.log(`[PMI] List request by ${user.username} - Total: ${filteredPMI.length}${searchFilter ? ` (search: "${searchFilter}")` : ''}${overdueOnlyFilter ? ' (overdue only)' : ''}`);

  res.json({
    pmi: filteredPMI,
    total: filteredPMI.length,
  });
});

// ============================================
// TCTO (Time Compliance Technical Order) API
// ============================================

// Helper to calculate days until compliance deadline
function calculateDaysUntilDeadline(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(dateString);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// GET /api/tcto - List all TCTOs for user's programs
app.get('/api/tcto', (req, res) => {
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

  // Get status filter from query string (optional)
  const statusFilter = req.query.status as string | undefined; // 'open', 'closed', or undefined for all

  // Get search filter from query string (optional)
  const searchFilter = req.query.search ? (req.query.search as string).toLowerCase().trim() : null;

  // Filter TCTO records by user's accessible programs
  let filteredTCTO = tctoRecords.filter(tcto => userProgramIds.includes(tcto.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredTCTO = filteredTCTO.filter(tcto => tcto.pgm_id === programIdFilter);
  }

  // Apply status filter if specified
  if (statusFilter === 'open' || statusFilter === 'closed') {
    filteredTCTO = filteredTCTO.filter(tcto => tcto.status === statusFilter);
  }

  // Apply search filter if specified (searches TCTO number and title)
  if (searchFilter) {
    filteredTCTO = filteredTCTO.filter(tcto =>
      tcto.tcto_no.toLowerCase().includes(searchFilter) ||
      tcto.title.toLowerCase().includes(searchFilter) ||
      tcto.description.toLowerCase().includes(searchFilter)
    );
  }

  // Calculate compliance info for each TCTO
  const tctoWithCompliance = filteredTCTO.map(tcto => {
    const daysUntilDeadline = calculateDaysUntilDeadline(tcto.compliance_deadline);
    const compliancePercentage = tcto.affected_assets.length > 0
      ? Math.round((tcto.compliant_assets.length / tcto.affected_assets.length) * 100)
      : 100;

    // Get program info
    const program = allPrograms.find(p => p.pgm_id === tcto.pgm_id);

    return {
      ...tcto,
      days_until_deadline: daysUntilDeadline,
      compliance_percentage: compliancePercentage,
      assets_remaining: tcto.affected_assets.length - tcto.compliant_assets.length,
      is_overdue: daysUntilDeadline < 0 && tcto.status === 'open',
      program_code: program?.pgm_cd || '',
      program_name: program?.pgm_name || '',
    };
  });

  // Sort by deadline (most urgent first), then by TCTO number
  tctoWithCompliance.sort((a, b) => {
    // Open TCTOs first
    if (a.status !== b.status) {
      return a.status === 'open' ? -1 : 1;
    }
    // Then by days until deadline
    return a.days_until_deadline - b.days_until_deadline;
  });

  // Calculate summary counts
  const summary = {
    total: tctoWithCompliance.length,
    open: tctoWithCompliance.filter(t => t.status === 'open').length,
    closed: tctoWithCompliance.filter(t => t.status === 'closed').length,
    overdue: tctoWithCompliance.filter(t => t.is_overdue).length,
    critical: tctoWithCompliance.filter(t => t.priority === 'Critical' && t.status === 'open').length,
    urgent: tctoWithCompliance.filter(t => t.priority === 'Urgent' && t.status === 'open').length,
    routine: tctoWithCompliance.filter(t => t.priority === 'Routine' && t.status === 'open').length,
  };

  console.log(`[TCTO] List request by ${user.username} - Total: ${summary.total}, Open: ${summary.open}, Closed: ${summary.closed}`);

  res.json({
    tcto: tctoWithCompliance,
    summary,
    total: tctoWithCompliance.length,
  });
});

// POST /api/tcto - Create new TCTO record
app.post('/api/tcto', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Only admin and depot_manager can create TCTOs
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Only Admin and Depot Manager can create TCTO records' });
  }

  const {
    tcto_no,
    title,
    tcto_type,
    sys_type,
    effective_date,
    compliance_deadline,
    priority,
    description,
    remarks,
  } = req.body;

  // Validation
  if (!tcto_no || tcto_no.trim() === '') {
    return res.status(400).json({ error: 'TCTO number is required' });
  }
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'TCTO title is required' });
  }
  if (!effective_date) {
    return res.status(400).json({ error: 'Effective date is required' });
  }
  if (!compliance_deadline) {
    return res.status(400).json({ error: 'Compliance deadline is required' });
  }
  if (!priority || !['Routine', 'Urgent', 'Critical'].includes(priority)) {
    return res.status(400).json({ error: 'Valid priority is required (Routine, Urgent, Critical)' });
  }

  // Get the current program ID (user's first accessible program or specified in request)
  const pgm_id = req.body.pgm_id || user.programs[0]?.pgm_id;
  if (!pgm_id) {
    return res.status(400).json({ error: 'Program ID is required' });
  }

  // Verify user has access to the program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this program' });
  }

  // Check for duplicate TCTO number within the program
  const existingTcto = tctoRecords.find(t =>
    t.tcto_no.toLowerCase() === tcto_no.trim().toLowerCase() && t.pgm_id === pgm_id
  );
  if (existingTcto) {
    return res.status(400).json({ error: 'TCTO number already exists for this program' });
  }

  // Create new TCTO record
  const newTCTO: TCTORecord = {
    tcto_id: tctoNextId++,
    tcto_no: tcto_no.trim(),
    title: title.trim(),
    effective_date,
    compliance_deadline,
    pgm_id,
    status: 'open',
    priority,
    affected_assets: [], // Assets can be added later
    compliant_assets: [],
    description: description?.trim() || '',
    created_by_id: user.user_id,
    created_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  // Add to records
  tctoRecords.push(newTCTO);

  // Calculate compliance info for response
  const daysUntilDeadline = calculateDaysUntilDeadline(newTCTO.compliance_deadline);
  const program = allPrograms.find(p => p.pgm_id === pgm_id);

  const responseData = {
    ...newTCTO,
    days_until_deadline: daysUntilDeadline,
    compliance_percentage: 100, // No assets yet
    assets_remaining: 0,
    is_overdue: daysUntilDeadline < 0,
    program_code: program?.pgm_cd || '',
    program_name: program?.pgm_name || '',
    tcto_type: tcto_type || '',
    sys_type: sys_type || '',
    remarks: remarks || '',
  };

  console.log(`[TCTO] Created TCTO ${newTCTO.tcto_no} (ID: ${newTCTO.tcto_id}) by ${user.username}`);

  res.status(201).json(responseData);
});

// PUT /api/tcto/:id - Update TCTO record
app.put('/api/tcto/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Only ADMIN and DEPOT_MANAGER can edit TCTOs
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Only Admin and Depot Manager can edit TCTO records' });
  }

  const tctoId = parseInt(req.params.id, 10);
  if (isNaN(tctoId)) {
    return res.status(400).json({ error: 'Invalid TCTO ID' });
  }

  // Find the TCTO record
  const tctoIndex = tctoRecords.findIndex(t => t.tcto_id === tctoId);
  if (tctoIndex === -1) {
    return res.status(404).json({ error: 'TCTO not found' });
  }

  const tcto = tctoRecords[tctoIndex];

  // Verify user has access to the TCTO's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(tcto.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this TCTO' });
  }

  const {
    effective_date,
    compliance_deadline,
    priority,
    status,
    description,
  } = req.body;

  // Validation
  if (effective_date !== undefined && !effective_date) {
    return res.status(400).json({ error: 'Effective date cannot be empty' });
  }
  if (compliance_deadline !== undefined && !compliance_deadline) {
    return res.status(400).json({ error: 'Compliance deadline cannot be empty' });
  }
  if (priority !== undefined && !['Routine', 'Urgent', 'Critical'].includes(priority)) {
    return res.status(400).json({ error: 'Valid priority is required (Routine, Urgent, Critical)' });
  }
  if (status !== undefined && !['open', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (open, closed)' });
  }

  // Update only provided fields
  if (effective_date !== undefined) {
    tcto.effective_date = effective_date;
  }
  if (compliance_deadline !== undefined) {
    tcto.compliance_deadline = compliance_deadline;
  }
  if (priority !== undefined) {
    tcto.priority = priority;
  }
  if (status !== undefined) {
    tcto.status = status;
  }
  if (description !== undefined) {
    tcto.description = description;
  }

  // Calculate compliance info for response
  const daysUntilDeadline = calculateDaysUntilDeadline(tcto.compliance_deadline);
  const compliancePercentage = tcto.affected_assets.length > 0
    ? Math.round((tcto.compliant_assets.length / tcto.affected_assets.length) * 100)
    : 100;
  const program = allPrograms.find(p => p.pgm_id === tcto.pgm_id);

  const responseData = {
    ...tcto,
    days_until_deadline: daysUntilDeadline,
    compliance_percentage: compliancePercentage,
    assets_remaining: tcto.affected_assets.length - tcto.compliant_assets.length,
    is_overdue: daysUntilDeadline < 0 && tcto.status === 'open',
    program_code: program?.pgm_cd || '',
    program_name: program?.pgm_name || '',
  };

  console.log(`[TCTO] Updated TCTO ${tcto.tcto_no} (ID: ${tcto.tcto_id}) by ${user.username}`);

  res.json({ message: 'TCTO updated successfully', tcto: responseData });
});

// DELETE /api/tcto/:id - Delete a TCTO record (ADMIN only)
app.delete('/api/tcto/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN can delete TCTO records
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Only administrators can delete TCTO records.' });
  }

  const tctoId = parseInt(req.params.id, 10);
  if (isNaN(tctoId)) {
    return res.status(400).json({ error: 'Invalid TCTO ID' });
  }

  // Find the TCTO record
  const tctoIndex = tctoRecords.findIndex(t => t.tcto_id === tctoId);
  if (tctoIndex === -1) {
    return res.status(404).json({ error: 'TCTO not found' });
  }

  const tcto = tctoRecords[tctoIndex];

  // Verify user has access to the TCTO's program (admin has access to all, but double-check)
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(tcto.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this TCTO' });
  }

  // Remove the TCTO record
  const deletedTCTO = tctoRecords.splice(tctoIndex, 1)[0];

  console.log(`[TCTO] Deleted TCTO ${deletedTCTO.tcto_no} (ID: ${deletedTCTO.tcto_id}) by ${user.username}`);

  res.json({
    message: 'TCTO deleted successfully',
    tcto: {
      tcto_id: deletedTCTO.tcto_id,
      tcto_no: deletedTCTO.tcto_no,
      title: deletedTCTO.title,
      status: deletedTCTO.status,
    },
  });
});

// GET /api/tcto/:id - Get a single TCTO with asset compliance details
app.get('/api/tcto/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const tctoId = parseInt(req.params.id, 10);
  if (isNaN(tctoId)) {
    return res.status(400).json({ error: 'Invalid TCTO ID' });
  }

  // Find the TCTO record
  const tcto = tctoRecords.find(t => t.tcto_id === tctoId);
  if (!tcto) {
    return res.status(404).json({ error: 'TCTO not found' });
  }

  // Verify user has access to the TCTO's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(tcto.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this TCTO' });
  }

  // Calculate compliance info
  const daysUntilDeadline = calculateDaysUntilDeadline(tcto.compliance_deadline);
  const compliancePercentage = tcto.affected_assets.length > 0
    ? Math.round((tcto.compliant_assets.length / tcto.affected_assets.length) * 100)
    : 100;

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === tcto.pgm_id);

  // Get detailed asset information for affected assets including completion data
  const completionDataForTcto = tctoAssetCompletionData.get(tctoId) || [];
  const affectedAssetsDetails = tcto.affected_assets.map(assetId => {
    const asset = mockAssets.find(a => a.asset_id === assetId);
    const isCompliant = tcto.compliant_assets.includes(assetId);
    const completionInfo = completionDataForTcto.find(c => c.asset_id === assetId);

    // Look up linked repair if present
    let linkedRepair = null;
    if (completionInfo?.linked_repair_id) {
      const repair = repairs.find(r => r.repair_id === completionInfo.linked_repair_id);
      if (repair) {
        const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
        linkedRepair = {
          repair_id: repair.repair_id,
          event_id: repair.event_id,
          job_no: event?.job_no || 'Unknown',
          narrative: repair.narrative,
        };
      }
    }

    return {
      asset_id: assetId,
      serno: asset?.serno || 'Unknown',
      partno: asset?.partno || 'Unknown',
      name: asset?.name || 'Unknown Asset',
      status_cd: asset?.status_cd || 'Unknown',
      admin_loc: asset?.admin_loc || 'Unknown',
      cust_loc: asset?.cust_loc || 'Unknown',
      is_compliant: isCompliant,
      compliance_status: isCompliant ? 'Compliant' : 'Non-Compliant',
      completion_date: completionInfo?.completion_date || null,
      linked_repair_id: completionInfo?.linked_repair_id || null,
      linked_repair: linkedRepair,
      completed_by: completionInfo?.completed_by_name || null,
      completed_at: completionInfo?.completed_at || null,
    };
  });

  const responseData = {
    tcto: {
      ...tcto,
      days_until_deadline: daysUntilDeadline,
      compliance_percentage: compliancePercentage,
      assets_remaining: tcto.affected_assets.length - tcto.compliant_assets.length,
      is_overdue: daysUntilDeadline < 0 && tcto.status === 'open',
      program_code: program?.pgm_cd || '',
      program_name: program?.pgm_name || '',
    },
    assets: affectedAssetsDetails,
    summary: {
      total_affected: tcto.affected_assets.length,
      compliant: tcto.compliant_assets.length,
      non_compliant: tcto.affected_assets.length - tcto.compliant_assets.length,
      compliance_percentage: compliancePercentage,
    },
  };

  console.log(`[TCTO] Detail request for ${tcto.tcto_no} (ID: ${tcto.tcto_id}) by ${user.username}`);

  res.json(responseData);
});

// POST /api/tcto/:id/compliance - Update asset compliance status for a TCTO
app.post('/api/tcto/:id/compliance', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can update compliance
  if (!['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)) {
    return res.status(403).json({ error: 'You do not have permission to update TCTO compliance' });
  }

  const tctoId = parseInt(req.params.id, 10);
  if (isNaN(tctoId)) {
    return res.status(400).json({ error: 'Invalid TCTO ID' });
  }

  const { asset_id, is_compliant, completion_date, linked_repair_id } = req.body;

  if (typeof asset_id !== 'number') {
    return res.status(400).json({ error: 'Asset ID is required' });
  }

  if (typeof is_compliant !== 'boolean') {
    return res.status(400).json({ error: 'Compliance status (is_compliant) is required' });
  }

  // If marking compliant, completion_date is required
  if (is_compliant && !completion_date) {
    return res.status(400).json({ error: 'Completion date is required when marking an asset as compliant' });
  }

  // Validate linked_repair_id if provided
  if (linked_repair_id !== undefined && linked_repair_id !== null && typeof linked_repair_id !== 'number') {
    return res.status(400).json({ error: 'Invalid linked repair ID' });
  }

  // Find the TCTO record
  const tctoIndex = tctoRecords.findIndex(t => t.tcto_id === tctoId);
  if (tctoIndex === -1) {
    return res.status(404).json({ error: 'TCTO not found' });
  }

  const tcto = tctoRecords[tctoIndex];

  // Verify user has access to the TCTO's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(tcto.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this TCTO' });
  }

  // Verify the asset is in the affected_assets list
  if (!tcto.affected_assets.includes(asset_id)) {
    return res.status(400).json({ error: 'Asset is not in the affected assets list for this TCTO' });
  }

  // Update compliance status
  const asset = mockAssets.find(a => a.asset_id === asset_id);
  let completionData: TCTOAssetCompletionData | undefined;

  if (is_compliant) {
    // Add to compliant list if not already there
    if (!tcto.compliant_assets.includes(asset_id)) {
      tcto.compliant_assets.push(asset_id);
    }

    // Store completion data
    completionData = {
      asset_id,
      completion_date: completion_date,
      linked_repair_id: linked_repair_id || undefined,
      completed_by_id: user.user_id,
      completed_by_name: user.full_name,
      completed_at: new Date().toISOString(),
    };

    // Initialize or update completion data array for this TCTO
    if (!tctoAssetCompletionData.has(tctoId)) {
      tctoAssetCompletionData.set(tctoId, []);
    }
    const completionArray = tctoAssetCompletionData.get(tctoId)!;
    const existingIndex = completionArray.findIndex(c => c.asset_id === asset_id);
    if (existingIndex !== -1) {
      completionArray[existingIndex] = completionData;
    } else {
      completionArray.push(completionData);
    }

    console.log(`[TCTO] Asset ${asset?.serno || asset_id} marked COMPLIANT for ${tcto.tcto_no} by ${user.username} (completion date: ${completion_date}${linked_repair_id ? `, linked repair: ${linked_repair_id}` : ''})`);
  } else {
    // Remove from compliant list if present
    const compliantIndex = tcto.compliant_assets.indexOf(asset_id);
    if (compliantIndex !== -1) {
      tcto.compliant_assets.splice(compliantIndex, 1);
    }

    // Remove completion data
    if (tctoAssetCompletionData.has(tctoId)) {
      const completionArray = tctoAssetCompletionData.get(tctoId)!;
      const existingIndex = completionArray.findIndex(c => c.asset_id === asset_id);
      if (existingIndex !== -1) {
        completionArray.splice(existingIndex, 1);
      }
    }

    console.log(`[TCTO] Asset ${asset?.serno || asset_id} marked NON-COMPLIANT for ${tcto.tcto_no} by ${user.username}`);
  }

  // Calculate updated compliance info
  const compliancePercentage = tcto.affected_assets.length > 0
    ? Math.round((tcto.compliant_assets.length / tcto.affected_assets.length) * 100)
    : 100;

  // Look up linked repair if provided
  let linkedRepair = null;
  if (linked_repair_id) {
    // Search through all events to find the repair
    for (const event of maintenanceEvents) {
      const repair = event.repairs.find(r => r.repair_id === linked_repair_id);
      if (repair) {
        linkedRepair = {
          repair_id: repair.repair_id,
          event_id: event.event_id,
          job_no: event.job_no,
          narrative: repair.narrative,
        };
        break;
      }
    }
  }

  res.json({
    message: `Asset ${asset?.serno || asset_id} ${is_compliant ? 'marked compliant' : 'marked non-compliant'} for ${tcto.tcto_no}`,
    asset: {
      asset_id: asset_id,
      serno: asset?.serno || 'Unknown',
      name: asset?.name || 'Unknown',
      is_compliant: is_compliant,
      completion_date: is_compliant ? completion_date : null,
      linked_repair_id: is_compliant ? linked_repair_id : null,
      linked_repair: linkedRepair,
      completed_by: is_compliant ? user.full_name : null,
      completed_at: is_compliant ? completionData?.completed_at : null,
    },
    tcto_summary: {
      total_affected: tcto.affected_assets.length,
      compliant: tcto.compliant_assets.length,
      non_compliant: tcto.affected_assets.length - tcto.compliant_assets.length,
      compliance_percentage: compliancePercentage,
    },
  });
});

// GET /api/tcto/:id/assets/:assetId/repairs - Get repairs for an asset to link to TCTO completion
app.get('/api/tcto/:id/assets/:assetId/repairs', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const tctoId = parseInt(req.params.id, 10);
  const assetId = parseInt(req.params.assetId, 10);

  if (isNaN(tctoId)) {
    return res.status(400).json({ error: 'Invalid TCTO ID' });
  }
  if (isNaN(assetId)) {
    return res.status(400).json({ error: 'Invalid asset ID' });
  }

  // Find the TCTO record
  const tcto = tctoRecords.find(t => t.tcto_id === tctoId);
  if (!tcto) {
    return res.status(404).json({ error: 'TCTO not found' });
  }

  // Verify user has access to the TCTO's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(tcto.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this TCTO' });
  }

  // Find the asset
  const asset = mockAssets.find(a => a.asset_id === assetId);
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Find maintenance events for this asset
  const assetEvents = maintenanceEvents.filter(e => e.asset_id === assetId);

  // Get all repairs for these events
  const assetRepairs: Array<{
    repair_id: number;
    event_id: number;
    job_no: string;
    repair_seq: number;
    type_maint: string | null;
    narrative: string | null;
    start_date: string;
    stop_date: string | null;
    shop_status: string;
  }> = [];

  assetEvents.forEach(event => {
    event.repairs.forEach(repair => {
      assetRepairs.push({
        repair_id: repair.repair_id,
        event_id: event.event_id,
        job_no: event.job_no,
        repair_seq: repair.repair_seq,
        type_maint: repair.type_maint,
        narrative: repair.narrative,
        start_date: repair.start_date,
        stop_date: repair.stop_date,
        shop_status: repair.shop_status,
      });
    });
  });

  // Sort by most recent first
  assetRepairs.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  console.log(`[TCTO] Repairs for asset ${asset.serno} (ID: ${assetId}) requested by ${user.username} - ${assetRepairs.length} repairs found`);

  res.json({
    asset_id: assetId,
    serno: asset.serno,
    repairs: assetRepairs,
    total: assetRepairs.length,
  });
});

// Mock Sortie data
interface Sortie {
  sortie_id: number;
  pgm_id: number;
  asset_id: number;
  mission_id: string;
  serno: string;
  ac_tailno: string | null;
  sortie_date: string;
  sortie_effect: string | null;
  current_unit: string | null;
  assigned_unit: string | null;
  range: string | null;
  reason: string | null;
  remarks: string | null;
}

// Persistent storage for sorties
let sorties: Sortie[] = [];

// Initialize sortie data
function initializeSorties(): void {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  sorties = [
    // CRIIS program sorties
    {
      sortie_id: 1,
      pgm_id: 1,
      asset_id: 1,
      mission_id: 'CRIIS-SORTIE-001',
      serno: 'CRIIS-001',
      ac_tailno: 'AC-001',
      sortie_date: addDays(-5),
      sortie_effect: 'Full Mission Capable',
      current_unit: 'Unit Alpha',
      assigned_unit: 'Unit Alpha',
      range: 'Range A',
      reason: 'Operational deployment',
      remarks: 'Successful reconnaissance mission',
    },
    {
      sortie_id: 2,
      pgm_id: 1,
      asset_id: 5,
      mission_id: 'CRIIS-SORTIE-002',
      serno: 'CRIIS-005',
      ac_tailno: 'AC-005',
      sortie_date: addDays(-3),
      sortie_effect: 'Partial Mission Capable',
      current_unit: 'Unit Bravo',
      assigned_unit: 'Unit Alpha',
      range: 'Range B',
      reason: 'Training exercise',
      remarks: 'Camera system showed intermittent issues',
    },
    {
      sortie_id: 3,
      pgm_id: 1,
      asset_id: 6,
      mission_id: 'CRIIS-SORTIE-003',
      serno: 'CRIIS-006',
      ac_tailno: 'AC-006',
      sortie_date: addDays(-10),
      sortie_effect: 'Non-Mission Capable',
      current_unit: 'Unit Alpha',
      assigned_unit: 'Unit Alpha',
      range: 'Range A',
      reason: 'Maintenance check flight',
      remarks: 'Power supply failure detected during flight',
    },
    {
      sortie_id: 4,
      pgm_id: 1,
      asset_id: 3,
      mission_id: 'CRIIS-SORTIE-004',
      serno: 'CRIIS-003',
      ac_tailno: 'AC-003',
      sortie_date: addDays(-2),
      sortie_effect: 'Full Mission Capable',
      current_unit: 'Unit Charlie',
      assigned_unit: 'Unit Charlie',
      range: 'Range C',
      reason: 'Surveillance mission',
      remarks: 'All systems operational',
    },
    // ACTS program sorties
    {
      sortie_id: 5,
      pgm_id: 2,
      asset_id: 13,
      mission_id: 'ACTS-SORTIE-001',
      serno: 'ACTS-001',
      ac_tailno: 'AC-101',
      sortie_date: addDays(-4),
      sortie_effect: 'Partial Mission Capable',
      current_unit: 'Unit Delta',
      assigned_unit: 'Unit Delta',
      range: 'Range D',
      reason: 'Target acquisition training',
      remarks: 'Laser designator alignment issue noted',
    },
    {
      sortie_id: 6,
      pgm_id: 2,
      asset_id: 14,
      mission_id: 'ACTS-SORTIE-002',
      serno: 'ACTS-002',
      ac_tailno: 'AC-102',
      sortie_date: addDays(-6),
      sortie_effect: 'Full Mission Capable',
      current_unit: 'Unit Echo',
      assigned_unit: 'Unit Echo',
      range: 'Range E',
      reason: 'Certification flight',
      remarks: 'All targeting subsystems passed certification',
    },
    // ARDS program sorties
    {
      sortie_id: 7,
      pgm_id: 3,
      asset_id: 17,
      mission_id: 'ARDS-SORTIE-001',
      serno: 'ARDS-001',
      ac_tailno: 'AC-201',
      sortie_date: addDays(-8),
      sortie_effect: 'Non-Mission Capable',
      current_unit: 'Unit Foxtrot',
      assigned_unit: 'Unit Foxtrot',
      range: 'Range F',
      reason: 'Data collection mission',
      remarks: 'Overheating issue during high-altitude operation',
    },
    // 236 program sorties
    {
      sortie_id: 8,
      pgm_id: 4,
      asset_id: 23,
      mission_id: '236-SORTIE-001',
      serno: '236-001',
      ac_tailno: 'AC-301',
      sortie_date: addDays(-4),
      sortie_effect: 'Full Mission Capable',
      current_unit: 'Unit Golf',
      assigned_unit: 'Unit Golf',
      range: 'Range G',
      reason: 'Classified operation',
      remarks: 'Classified - refer to secure documentation',
    },
  ];
}

// Initialize sorties on startup
initializeSorties();

// TCTO (Time Compliance Technical Order) Interface
interface TCTORecord {
  tcto_id: number;
  tcto_no: string;        // TCTO number (unique per program)
  title: string;          // TCTO title/description
  effective_date: string; // Date TCTO became effective
  compliance_deadline: string; // Deadline for compliance
  pgm_id: number;
  status: 'open' | 'closed'; // Overall TCTO status
  priority: 'Routine' | 'Urgent' | 'Critical';
  affected_assets: number[]; // Array of asset_ids that need compliance
  compliant_assets: number[]; // Array of asset_ids that are compliant
  description: string;    // Full TCTO description
  created_by_id: number;
  created_by_name: string;
  created_at: string;
}

// Asset completion data for TCTO compliance
interface TCTOAssetCompletionData {
  asset_id: number;
  completion_date: string;
  linked_repair_id?: number;
  completed_by_id: number;
  completed_by_name: string;
  completed_at: string;
}

// Storage for asset completion data (keyed by tcto_id)
const tctoAssetCompletionData: Map<number, TCTOAssetCompletionData[]> = new Map();

// Persistent storage for TCTO records
let tctoRecords: TCTORecord[] = [];
let tctoNextId = 6; // Start after mock data IDs

// Initialize TCTO data
function initializeTCTOData(): void {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  tctoRecords = [
    // CRIIS program TCTOs
    {
      tcto_id: 1,
      tcto_no: 'TCTO-2024-001',
      title: 'Sensor Firmware Update v2.3.1',
      effective_date: addDays(-30),
      compliance_deadline: addDays(15),
      pgm_id: 1,
      status: 'open',
      priority: 'Urgent',
      affected_assets: [1, 2, 3], // CRIIS-001, CRIIS-002, CRIIS-003
      compliant_assets: [1], // CRIIS-001 is compliant
      description: 'Critical firmware update addressing sensor calibration drift issue. All affected sensor units must be updated before deadline.',
      created_by_id: 1,
      created_by_name: 'John Admin',
      created_at: addDays(-30),
    },
    {
      tcto_id: 2,
      tcto_no: 'TCTO-2024-002',
      title: 'Communication System Software Patch',
      effective_date: addDays(-45),
      compliance_deadline: addDays(-5), // Overdue
      pgm_id: 1,
      status: 'open',
      priority: 'Critical',
      affected_assets: [8, 9, 10], // CRIIS-008, CRIIS-009, CRIIS-010
      compliant_assets: [], // None compliant yet
      description: 'Mandatory software patch to address communication security vulnerability CVE-2024-1234.',
      created_by_id: 1,
      created_by_name: 'John Admin',
      created_at: addDays(-45),
    },
    {
      tcto_id: 3,
      tcto_no: 'TCTO-2024-003',
      title: 'Radar Unit Calibration Procedure Update',
      effective_date: addDays(-60),
      compliance_deadline: addDays(-30),
      pgm_id: 1,
      status: 'closed',
      priority: 'Routine',
      affected_assets: [6, 7], // CRIIS-006, CRIIS-007
      compliant_assets: [6, 7], // All compliant
      description: 'Updated calibration procedure for improved accuracy in high-altitude operations.',
      created_by_id: 1,
      created_by_name: 'John Admin',
      created_at: addDays(-60),
    },
    // ACTS program TCTOs
    {
      tcto_id: 4,
      tcto_no: 'TCTO-2024-004',
      title: 'Targeting System Optics Alignment',
      effective_date: addDays(-20),
      compliance_deadline: addDays(30),
      pgm_id: 2,
      status: 'open',
      priority: 'Urgent',
      affected_assets: [11, 12, 13], // ACTS-001, ACTS-002, ACTS-003
      compliant_assets: [11], // ACTS-001 compliant
      description: 'Realignment procedure for targeting optics to correct parallax error identified in field reports.',
      created_by_id: 2,
      created_by_name: 'Jane Depot',
      created_at: addDays(-20),
    },
    // ARDS program TCTOs
    {
      tcto_id: 5,
      tcto_no: 'TCTO-2024-005',
      title: 'Data Processing Unit Memory Upgrade',
      effective_date: addDays(-10),
      compliance_deadline: addDays(60),
      pgm_id: 3,
      status: 'open',
      priority: 'Routine',
      affected_assets: [17, 18, 19], // ARDS-001, ARDS-002, ARDS-003
      compliant_assets: [],
      description: 'Memory module replacement to support new data processing algorithms in software update 3.0.',
      created_by_id: 2,
      created_by_name: 'Jane Depot',
      created_at: addDays(-10),
    },
  ];

  // Initialize completion data with some repairs linked to TCTOs
  // TCTO-2024-001: CRIIS-001 and CRIIS-002 are compliant (with linked repairs for testing)
  tctoAssetCompletionData.set(1, [
    {
      asset_id: 1, // CRIIS-001
      is_compliant: true,
      completion_date: addDays(-1),
      linked_repair_id: null, // No repair linked for CRIIS-001
      completed_by: 'John Admin',
      completed_at: addDays(-1),
    },
    {
      asset_id: 2, // CRIIS-002
      is_compliant: true,
      completion_date: addDays(-1),
      linked_repair_id: 1, // Linked to repair #1 from MX-2024-001
      completed_by: 'Bob Field',
      completed_at: addDays(-1),
    },
    {
      asset_id: 3, // CRIIS-003
      is_compliant: true,
      completion_date: addDays(-1),
      linked_repair_id: null,
      completed_by: 'Jane Depot',
      completed_at: addDays(-1),
    },
  ]);

  // Update compliant_assets to match completion data
  tctoRecords[0].compliant_assets = [1, 2, 3];

  // TCTO-2024-003: Both assets compliant (completed TCTO)
  tctoAssetCompletionData.set(3, [
    {
      asset_id: 6, // CRIIS-006
      is_compliant: true,
      completion_date: addDays(-30),
      linked_repair_id: null,
      completed_by: 'Jane Depot',
      completed_at: addDays(-30),
    },
    {
      asset_id: 7, // CRIIS-007
      is_compliant: true,
      completion_date: addDays(-30),
      linked_repair_id: null,
      completed_by: 'Jane Depot',
      completed_at: addDays(-30),
    },
  ]);
}

// Initialize TCTO data on startup
initializeTCTOData();

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
  etic?: string | null; // Estimated Time In Commission
  sortie_id?: number | null; // Associated sortie (optional)
  pqdr?: boolean; // Product Quality Deficiency Report flag
  created_by_id?: number;
  created_by_name?: string;
  created_at?: string;
}

// Persistent storage for maintenance events (initialized with mock data)
let maintenanceEvents: MaintenanceEvent[] = [];
let maintenanceEventNextId = 11; // Start after mock data IDs
let maintenanceJobNextSeq = 11; // Start after mock job numbers (MX-2024-010)

// Location-based job number tracking
// Key: location string, Value: next sequence number for that location
const locationJobSeqMap: Map<string, number> = new Map();

// Initialize maintenance events on startup
function initializeMaintenanceEvents(): void {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  maintenanceEvents = [
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
      sortie_id: 2, // Linked to CRIIS-SORTIE-002 (Camera system showed intermittent issues)
      pqdr: true, // Flagged for PQDR - suspected manufacturing defect
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
      sortie_id: 3, // Linked to CRIIS-SORTIE-003 (Power supply failure detected during flight)
      pqdr: false,
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
      sortie_id: null, // Not linked to a sortie (routine maintenance)
      pqdr: false,
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
      pqdr: false,
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
      pqdr: true, // Flagged for PQDR - recurring optical alignment issue
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
      pqdr: false,
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
      pqdr: false,
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
      pqdr: false,
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
      pqdr: false,
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
      pqdr: false,
    },
  ];
}

// Initialize maintenance events on server start
initializeMaintenanceEvents();

// Initialize location job sequence tracking based on existing events
// This ensures new job numbers don't conflict with existing ones
function initializeLocationJobSeqMap(): void {
  // Group existing events by location and find the highest sequence per location
  maintenanceEvents.forEach(event => {
    const currentMax = locationJobSeqMap.get(event.location) || 0;
    // Try to parse the sequence from the job number
    // Format: MX-{PREFIX}-{YEAR}-{SEQ} or legacy MX-{YEAR}-{SEQ}
    const parts = event.job_no.split('-');
    if (parts.length >= 2) {
      const seqStr = parts[parts.length - 1]; // Last part is always the sequence
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq) && seq > currentMax) {
        locationJobSeqMap.set(event.location, seq);
      }
    }
  });

  // Increment each location's sequence so new events start after existing ones
  locationJobSeqMap.forEach((seq, location) => {
    locationJobSeqMap.set(location, seq + 1);
  });

  console.log('[EVENTS] Location job sequence map initialized:', Object.fromEntries(locationJobSeqMap));
}
initializeLocationJobSeqMap();

// Repair interface for maintenance event repairs
interface Repair {
  repair_id: number;
  event_id: number;
  repair_seq: number;
  asset_id: number;
  start_date: string;
  stop_date: string | null;
  type_maint: string; // 'Corrective' | 'Preventive' | 'Modification' | 'Inspection'
  how_mal: string | null; // How Malfunctioned code
  when_disc: string | null; // When Discovered code
  action_taken: string | null; // Action Taken code (T = cannibalization, R = repair, etc.)
  shop_status: 'open' | 'closed';
  narrative: string;
  tag_no: string | null;
  doc_no: string | null;
  micap: boolean; // Mission Capable impacting flag
  micap_login: string | null; // User who flagged as MICAP
  chief_review: boolean; // Flagged for chief review
  chief_review_by: string | null; // User who flagged for chief review
  super_review: boolean; // Flagged for supervisor review
  super_review_by: string | null; // User who flagged for supervisor review
  repeat_recur: boolean; // Flagged as repeat/recurring issue
  repeat_recur_by: string | null; // User who flagged as repeat/recur
  // Cannibalization (Action T) fields
  donor_asset_id: number | null; // ID of asset being cannibalized from
  donor_asset_sn: string | null; // Serial number of donor asset
  donor_asset_pn: string | null; // Part number of donor asset
  donor_asset_name: string | null; // Name of donor asset
  // ETI (Elapsed Time Indicator) tracking
  eti_in: number | null; // ETI meter value at repair start
  eti_out: number | null; // ETI meter value at repair end
  eti_delta: number | null; // Calculated difference (eti_out - eti_in)
  created_by_name: string;
  created_at: string;
}

// Persistent storage for repairs
let repairs: Repair[] = [];
let repairNextId = 20; // Start after mock data IDs

// Initialize repairs with mock data
function initializeRepairs(): void {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  repairs = [
    // Repairs for Event 1 (MX-2024-001 - Power failure) - 2 repairs, 1 open
    {
      repair_id: 1,
      event_id: 1,
      repair_seq: 1,
      asset_id: 5,
      start_date: addDays(-5),
      stop_date: addDays(-4),
      type_maint: 'Corrective',
      how_mal: 'PWR',
      when_disc: 'BIT',
      action_taken: 'R', // Regular repair
      shop_status: 'closed',
      narrative: 'Replaced faulty power supply connector. Tested - intermittent fault no longer present.',
      tag_no: 'TAG-001',
      doc_no: 'DOC-2024-001',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 780.5,
      eti_out: 782.0,
      eti_delta: 1.5,
      created_by_name: 'Bob Field',
      created_at: addDays(-5),
    },
    {
      repair_id: 2,
      event_id: 1,
      repair_seq: 2,
      asset_id: 5,
      start_date: addDays(-3),
      stop_date: null,
      type_maint: 'Corrective',
      how_mal: 'PWR',
      when_disc: 'OPS',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Additional power fault found. Investigating main circuit board.',
      tag_no: 'TAG-002',
      doc_no: null,
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: true, // This repair is flagged as repeat/recur
      repeat_recur_by: 'bob_field',
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 782.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Bob Field',
      created_at: addDays(-3),
    },
    // Repairs for Event 2 (MX-2024-002 - Radar) - 1 open repair
    {
      repair_id: 3,
      event_id: 2,
      repair_seq: 1,
      asset_id: 6,
      start_date: addDays(-10),
      stop_date: null,
      type_maint: 'Corrective',
      how_mal: 'FAIL',
      when_disc: 'OPS',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Power supply module failed. Awaiting replacement part PN-PSU-001.',
      tag_no: 'TAG-003',
      doc_no: 'DOC-2024-002',
      micap: true, // This repair is flagged as MICAP
      micap_login: 'jane_depot',
      chief_review: false,
      chief_review_by: null,
      super_review: true, // This repair is flagged for supervisor review
      super_review_by: 'jane_depot',
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 1500.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Jane Depot',
      created_at: addDays(-10),
    },
    // Repairs for Event 3 (MX-2024-003 - PMI) - 1 open repair
    {
      repair_id: 4,
      event_id: 3,
      repair_seq: 1,
      asset_id: 3,
      start_date: addDays(-2),
      stop_date: null,
      type_maint: 'Preventive',
      how_mal: null,
      when_disc: 'PMI',
      action_taken: null,
      shop_status: 'open',
      narrative: '90-day calibration in progress. Sensor alignment adjustments underway.',
      tag_no: 'TAG-004',
      doc_no: 'DOC-2024-003',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 2100.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Bob Field',
      created_at: addDays(-2),
    },
    // Repairs for Event 4 (MX-2024-004 - TCTO) - 1 open repair
    {
      repair_id: 5,
      event_id: 4,
      repair_seq: 1,
      asset_id: 8,
      start_date: addDays(-1),
      stop_date: null,
      type_maint: 'Modification',
      how_mal: null,
      when_disc: 'TCTO',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Applying software update per TCTO 2024-15. Download and install in progress.',
      tag_no: 'TAG-005',
      doc_no: 'DOC-2024-004',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 550.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Bob Field',
      created_at: addDays(-1),
    },
    // Repairs for Event 5 (ACTS) - 1 open repair
    {
      repair_id: 6,
      event_id: 5,
      repair_seq: 1,
      asset_id: 13,
      start_date: addDays(-3),
      stop_date: null,
      type_maint: 'Corrective',
      how_mal: 'OPTIC',
      when_disc: 'BIT',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Optical sensor cleaning and realignment in progress.',
      tag_no: 'TAG-006',
      doc_no: 'DOC-2024-005',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 1200.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Jane Depot',
      created_at: addDays(-3),
    },
    // Repairs for Event 6 (ACTS) - 1 open repair
    {
      repair_id: 7,
      event_id: 6,
      repair_seq: 1,
      asset_id: 14,
      start_date: addDays(-5),
      stop_date: null,
      type_maint: 'Inspection',
      how_mal: null,
      when_disc: 'PMI',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Full system inspection underway. Checking all targeting subsystems.',
      tag_no: 'TAG-007',
      doc_no: 'DOC-2024-006',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 890.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Jane Depot',
      created_at: addDays(-5),
    },
    // Repairs for Event 7 (ARDS) - 1 open repair
    {
      repair_id: 8,
      event_id: 7,
      repair_seq: 1,
      asset_id: 17,
      start_date: addDays(-7),
      stop_date: null,
      type_maint: 'Corrective',
      how_mal: 'OVHT',
      when_disc: 'OPS',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Thermal paste reapplication and cooling fan inspection.',
      tag_no: 'TAG-008',
      doc_no: 'DOC-2024-007',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 620.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'Bob Field',
      created_at: addDays(-7),
    },
    // Repairs for Event 8 (closed) - all closed
    {
      repair_id: 9,
      event_id: 8,
      repair_seq: 1,
      asset_id: 1,
      start_date: addDays(-15),
      stop_date: addDays(-13),
      type_maint: 'Preventive',
      how_mal: null,
      when_disc: 'PMI',
      action_taken: 'M', // Regular maintenance
      shop_status: 'closed',
      narrative: '30-day inspection completed. All systems nominal.',
      tag_no: 'TAG-009',
      doc_no: 'DOC-2024-008',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 1235.0,
      eti_out: 1238.5,
      eti_delta: 3.5,
      created_by_name: 'Bob Field',
      created_at: addDays(-15),
    },
    {
      repair_id: 10,
      event_id: 8,
      repair_seq: 2,
      asset_id: 1,
      start_date: addDays(-14),
      stop_date: addDays(-12),
      type_maint: 'Preventive',
      how_mal: null,
      when_disc: 'PMI',
      action_taken: 'L', // Lubrication
      shop_status: 'closed',
      narrative: 'Lubrication and cable inspection completed.',
      tag_no: 'TAG-010',
      doc_no: 'DOC-2024-009',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 1238.5,
      eti_out: 1240.0,
      eti_delta: 1.5,
      created_by_name: 'Bob Field',
      created_at: addDays(-14),
    },
    // Repairs for Event 9 (closed) - all closed
    {
      repair_id: 11,
      event_id: 9,
      repair_seq: 1,
      asset_id: 11,
      start_date: addDays(-20),
      stop_date: addDays(-18),
      type_maint: 'Preventive',
      how_mal: null,
      when_disc: 'PMI',
      action_taken: 'C', // Calibration
      shop_status: 'closed',
      narrative: 'Annual calibration completed successfully. All targets within spec.',
      tag_no: 'TAG-011',
      doc_no: 'DOC-2024-010',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 3450.0,
      eti_out: 3455.0,
      eti_delta: 5.0,
      created_by_name: 'Jane Depot',
      created_at: addDays(-20),
    },
    // Repairs for Event 10 (236 program) - 1 open repair
    {
      repair_id: 12,
      event_id: 10,
      repair_seq: 1,
      asset_id: 23,
      start_date: addDays(-4),
      stop_date: null,
      type_maint: 'Corrective',
      how_mal: 'COMP',
      when_disc: 'BIT',
      action_taken: null,
      shop_status: 'open',
      narrative: 'Classified component replacement required. Awaiting secure delivery.',
      tag_no: 'TAG-012',
      doc_no: 'DOC-2024-011',
      micap: false,
      micap_login: null,
      chief_review: false,
      chief_review_by: null,
      super_review: false,
      super_review_by: null,
      repeat_recur: false,
      repeat_recur_by: null,
      donor_asset_id: null,
      donor_asset_sn: null,
      donor_asset_pn: null,
      donor_asset_name: null,
      eti_in: 150.0,
      eti_out: null,
      eti_delta: null,
      created_by_name: 'John Admin',
      created_at: addDays(-4),
    },
  ];
}

// Initialize repairs on server start
initializeRepairs();

// InstalledPart interface for tracking parts installed during repairs
interface InstalledPart {
  installed_part_id: number;
  repair_id: number;
  event_id: number;
  asset_id: number; // The asset that was installed
  asset_sn: string; // Serial number of installed asset
  asset_pn: string; // Part number of installed asset
  asset_name: string; // Name of installed asset
  installation_date: string;
  installation_notes: string | null;
  previous_location: string | null; // Where the asset was before installation
  installed_by: number;
  installed_by_name: string;
  created_at: string;
}

// Persistent storage for installed parts
let installedParts: InstalledPart[] = [];
let installedPartNextId = 1;

// Initialize installed parts with mock data
function initializeInstalledParts(): void {
  // Example: Part installed in Repair #1 (closed repair)
  installedParts = [
    {
      installed_part_id: 1,
      repair_id: 1,
      event_id: 1,
      asset_id: 2, // Example asset
      asset_sn: 'CRIIS-002',
      asset_pn: 'PN-PWR-001',
      asset_name: 'Power Supply Unit',
      installation_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      installation_notes: 'Replaced faulty PSU connector with spare unit',
      previous_location: 'Depot Alpha',
      installed_by: 3,
      installed_by_name: 'Bob Field',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  installedPartNextId = 2;
}

// Initialize installed parts on server start
initializeInstalledParts();

// RemovedPart interface for tracking parts removed during repairs
interface RemovedPart {
  removed_part_id: number;
  repair_id: number;
  event_id: number;
  asset_id: number; // The asset that was removed
  asset_sn: string; // Serial number of removed asset
  asset_pn: string; // Part number of removed asset
  asset_name: string; // Name of removed asset
  removal_date: string;
  removal_reason: string | null; // Reason for removal (failed, damaged, etc.)
  removal_notes: string | null;
  new_status: string | null; // What status the asset should be set to (NMCM, NMCS, etc.)
  removed_by: number;
  removed_by_name: string;
  created_at: string;
}

// Persistent storage for removed parts
let removedParts: RemovedPart[] = [];
let removedPartNextId = 1;

// Initialize removed parts with mock data
function initializeRemovedParts(): void {
  // Example: Part removed in Repair #1 (closed repair)
  removedParts = [
    {
      removed_part_id: 1,
      repair_id: 1,
      event_id: 1,
      asset_id: 3, // Example asset - CRIIS-003 Sensor Unit B
      asset_sn: 'CRIIS-003',
      asset_pn: 'PN-SENSOR-B',
      asset_name: 'Sensor Unit B',
      removal_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      removal_reason: 'FAILED',
      removal_notes: 'Faulty power connector caused sensor failure. Removed for depot repair.',
      new_status: 'NMCM',
      removed_by: 3,
      removed_by_name: 'Bob Field',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  removedPartNextId = 2;
}

// Initialize removed parts on server start
initializeRemovedParts();

// ============================================
// LABOR RECORDS
// ============================================

// Labor interface for tracking labor records within repairs
interface Labor {
  labor_id: number;
  repair_id: number;
  labor_seq: number;
  asset_id: number;
  action_taken: string | null; // Action taken code
  how_mal: string | null;
  when_disc: string | null;
  type_maint: string | null;
  cat_labor: string | null; // Category of labor code
  start_date: string;
  stop_date: string | null;
  hours: number | null;
  crew_chief: string | null;
  crew_size: number | null;
  corrective: string | null; // Corrective action narrative
  discrepancy: string | null; // Discrepancy description
  remarks: string | null;
  corrected_by: string | null;
  inspected_by: string | null;
  bit_log: string | null; // BIT (Built-In Test) log capture
  sent_imds: boolean;
  valid: boolean;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

// Persistent storage for labor records
let laborRecords: Labor[] = [];
let laborNextId = 1;

// Initialize labor records with mock data
function initializeLaborRecords(): void {
  const today = new Date();
  const addDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  laborRecords = [
    // Labor for Repair #1 (closed repair for Event 1)
    {
      labor_id: 1,
      repair_id: 1,
      labor_seq: 1,
      asset_id: 1,
      action_taken: 'R', // Repair
      how_mal: 'D', // Discovered by operator
      when_disc: 'OPS', // Operations
      type_maint: 'U', // Unscheduled
      cat_labor: 'R', // Repair
      start_date: addDays(-5),
      stop_date: addDays(-4),
      hours: 4.5,
      crew_chief: 'Bob Field',
      crew_size: 2,
      corrective: 'Replaced faulty power connector. Tested system functionality.',
      discrepancy: 'Power connector failed causing intermittent connection issues.',
      remarks: 'Used spare connector from inventory',
      corrected_by: 'Bob Field',
      inspected_by: 'Jane Depot',
      bit_log: null,
      sent_imds: false,
      valid: true,
      created_by: 3,
      created_by_name: 'Bob Field',
      created_at: addDays(-5),
    },
    // Labor for Repair #2 (open repair for Event 1)
    {
      labor_id: 2,
      repair_id: 2,
      labor_seq: 1,
      asset_id: 1,
      action_taken: 'I', // Inspect
      how_mal: 'PMI', // Periodic Maintenance
      when_disc: 'PMI', // PMI
      type_maint: 'S', // Scheduled
      cat_labor: 'I', // Inspection
      start_date: addDays(-3),
      stop_date: null,
      hours: 2.0,
      crew_chief: 'Bob Field',
      crew_size: 1,
      corrective: 'Initial inspection complete. Pending additional diagnostics.',
      discrepancy: 'Visual inspection revealed minor wear on sensor housing.',
      remarks: null,
      corrected_by: null,
      inspected_by: 'Bob Field',
      bit_log: 'BIT passed all tests',
      sent_imds: false,
      valid: true,
      created_by: 3,
      created_by_name: 'Bob Field',
      created_at: addDays(-3),
    },
  ];
  laborNextId = 3;
}

// Initialize labor records on server start
initializeLaborRecords();

// Attachment interface for maintenance event attachments
interface Attachment {
  attachment_id: number;
  event_id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_at: string;
  description: string | null;
}

// Persistent storage for attachments
let attachments: Attachment[] = [];
let attachmentNextId = 1;

// Helper function to generate location prefix from location name
function getLocationPrefix(location: string): string {
  // Create a short prefix from the location name
  // e.g., "Depot Alpha" -> "DA", "Field Site Bravo" -> "FSB"
  const words = location.trim().split(/\s+/);
  if (words.length === 1) {
    // Single word: use first 3 characters
    return words[0].substring(0, 3).toUpperCase();
  }
  // Multiple words: use first letter of each word
  return words.map(w => w.charAt(0).toUpperCase()).join('');
}

// Helper function to generate job number unique per location
function generateJobNumber(location: string): string {
  const year = new Date().getFullYear();
  const prefix = getLocationPrefix(location);

  // Get or initialize the sequence for this location
  const currentSeq = locationJobSeqMap.get(location) || 1;
  locationJobSeqMap.set(location, currentSeq + 1);

  const seq = String(currentSeq).padStart(3, '0');
  return `MX-${prefix}-${year}-${seq}`;
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

  // Use persistent maintenance events array
  const allEvents = maintenanceEvents;

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

// List all maintenance events (requires authentication)
app.get('/api/events', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get query parameters
  const programIdFilter = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;
  const statusFilter = req.query.status as string | undefined; // 'open', 'closed', or undefined for all
  const eventTypeFilter = req.query.event_type as string | undefined; // 'Standard', 'PMI', 'TCTO', 'BIT/PC', or undefined for all
  const pqdrFilter = req.query.pqdr as string | undefined; // 'true' to filter only PQDR flagged events
  const searchQuery = req.query.search as string | undefined;
  const dateFrom = req.query.date_from as string | undefined; // Filter events starting from this date (YYYY-MM-DD)
  const dateTo = req.query.date_to as string | undefined; // Filter events up to this date (YYYY-MM-DD)
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  // Use persistent maintenance events array
  const allEvents = maintenanceEvents;

  // Filter by user's accessible programs
  let filteredEvents = allEvents.filter(event => userProgramIds.includes(event.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredEvents = filteredEvents.filter(event => event.pgm_id === programIdFilter);
  }

  // Apply status filter if specified
  if (statusFilter === 'open' || statusFilter === 'closed') {
    filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
  }

  // Apply event type filter if specified
  const validEventTypes = ['Standard', 'PMI', 'TCTO', 'BIT/PC'];
  if (eventTypeFilter && validEventTypes.includes(eventTypeFilter)) {
    filteredEvents = filteredEvents.filter(event => event.event_type === eventTypeFilter);
  }

  // Apply PQDR filter if specified
  if (pqdrFilter === 'true') {
    filteredEvents = filteredEvents.filter(event => event.pqdr === true);
  }

  // Apply search filter if specified
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      event.job_no.toLowerCase().includes(query) ||
      event.asset_sn.toLowerCase().includes(query) ||
      event.asset_name.toLowerCase().includes(query) ||
      event.discrepancy.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  }

  // Apply date range filter if specified (based on start_job date)
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    fromDate.setHours(0, 0, 0, 0); // Start of day
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.start_job);
      return eventDate >= fromDate;
    });
  }
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.start_job);
      return eventDate <= toDate;
    });
  }

  // Sort by priority (Critical first, then Urgent, then Routine), then by start date (newest first)
  const priorityOrder: Record<string, number> = { Critical: 0, Urgent: 1, Routine: 2 };
  filteredEvents.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.start_job).getTime() - new Date(a.start_job).getTime();
  });

  // Calculate pagination
  const total = filteredEvents.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedEvents = filteredEvents.slice(offset, offset + limit);

  // Calculate summary counts
  const summary = {
    open: filteredEvents.filter(e => e.status === 'open').length,
    closed: filteredEvents.filter(e => e.status === 'closed').length,
    critical: filteredEvents.filter(e => e.status === 'open' && e.priority === 'Critical').length,
    urgent: filteredEvents.filter(e => e.status === 'open' && e.priority === 'Urgent').length,
    routine: filteredEvents.filter(e => e.status === 'open' && e.priority === 'Routine').length,
    pqdr: filteredEvents.filter(e => e.pqdr === true).length, // Count of PQDR flagged events
    total: filteredEvents.length,
  };

  // Get program info
  const currentProgramId = programIdFilter || user.programs.find(p => p.is_default)?.pgm_id || user.programs[0]?.pgm_id;
  const programInfo = user.programs.find(p => p.pgm_id === currentProgramId);

  console.log(`[EVENTS] List request by ${user.username} - Total: ${total}, Open: ${summary.open}, Closed: ${summary.closed}`);

  res.json({
    events: paginatedEvents,
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
    },
    summary,
    program: programInfo,
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
  const event = maintenanceEvents.find(e => e.event_id === eventId);

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

// Create new maintenance event (requires authentication)
// Roles: ADMIN, DEPOT_MANAGER, FIELD_TECHNICIAN can create events
app.post('/api/events', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can create events
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to create maintenance events.' });
  }

  // Extract and validate request body
  const {
    asset_id,
    discrepancy,
    event_type,
    priority,
    start_job,
    etic,
    location,
    sortie_id,
  } = req.body;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Asset is required' });
  }
  if (!discrepancy || discrepancy.trim() === '') {
    return res.status(400).json({ error: 'Discrepancy description is required' });
  }
  if (!event_type || !['Standard', 'PMI', 'TCTO', 'BIT/PC'].includes(event_type)) {
    return res.status(400).json({ error: 'Valid event type is required (Standard, PMI, TCTO, BIT/PC)' });
  }
  if (!start_job) {
    return res.status(400).json({ error: 'Date in is required' });
  }

  // Find the asset
  const asset = mockAssets.find(a => a.asset_id === parseInt(asset_id, 10));
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check user has access to the asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this asset\'s program' });
  }

  // Determine the location for this event
  const eventLocation = location || asset.admin_loc || 'Unknown';

  // Generate new event ID and job number (unique per location)
  const newEventId = maintenanceEventNextId++;
  const newJobNo = generateJobNumber(eventLocation);

  // Validate sortie_id if provided
  let validSortieId: number | null = null;
  if (sortie_id) {
    const sortie = sorties.find(s => s.sortie_id === parseInt(sortie_id, 10));
    if (!sortie) {
      return res.status(400).json({ error: 'Selected sortie not found' });
    }
    // Verify sortie belongs to same program as asset
    if (sortie.pgm_id !== asset.pgm_id) {
      return res.status(400).json({ error: 'Sortie must belong to the same program as the asset' });
    }
    validSortieId = sortie.sortie_id;
  }

  // Create the new maintenance event
  const newEvent: MaintenanceEvent = {
    event_id: newEventId,
    asset_id: asset.asset_id,
    asset_sn: asset.serno,
    asset_name: asset.name,
    job_no: newJobNo,
    discrepancy: discrepancy.trim(),
    start_job: start_job,
    stop_job: null,
    event_type: event_type,
    priority: priority || 'Routine',
    status: 'open',
    pgm_id: asset.pgm_id,
    location: eventLocation,
    etic: etic || null,
    sortie_id: validSortieId,
    created_by_id: user.user_id,
    created_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString(),
  };

  // Add to the persistent array
  maintenanceEvents.push(newEvent);

  console.log(`[EVENTS] Created maintenance event ${newJobNo} by ${user.username} for asset ${asset.serno}`);

  res.status(201).json({
    message: 'Maintenance event created successfully',
    event: newEvent,
  });
});

// Update maintenance event (requires authentication)
// Roles: ADMIN, DEPOT_MANAGER, FIELD_TECHNICIAN can edit events
app.put('/api/events/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can edit events
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to edit maintenance events.' });
  }

  const eventId = parseInt(req.params.id, 10);
  const eventIndex = maintenanceEvents.findIndex(e => e.event_id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  const event = maintenanceEvents[eventIndex];

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Extract fields that can be updated
  const {
    discrepancy,
    event_type,
    priority,
    etic,
    location,
    status,
    stop_job,
    sortie_id,
    pqdr,
  } = req.body;

  // Update allowed fields
  if (discrepancy !== undefined && discrepancy.trim() !== '') {
    maintenanceEvents[eventIndex].discrepancy = discrepancy.trim();
  }

  if (event_type !== undefined && ['Standard', 'PMI', 'TCTO', 'BIT/PC'].includes(event_type)) {
    maintenanceEvents[eventIndex].event_type = event_type;
  }

  if (priority !== undefined && ['Routine', 'Urgent', 'Critical'].includes(priority)) {
    maintenanceEvents[eventIndex].priority = priority;
  }

  if (etic !== undefined) {
    maintenanceEvents[eventIndex].etic = etic || null;
  }

  if (location !== undefined) {
    maintenanceEvents[eventIndex].location = location;
  }

  // Handle sortie_id update
  if (sortie_id !== undefined) {
    if (sortie_id === null || sortie_id === '') {
      maintenanceEvents[eventIndex].sortie_id = null;
    } else {
      const sortie = sorties.find(s => s.sortie_id === parseInt(sortie_id, 10));
      if (!sortie) {
        return res.status(400).json({ error: 'Selected sortie not found' });
      }
      // Verify sortie belongs to same program as event
      if (sortie.pgm_id !== event.pgm_id) {
        return res.status(400).json({ error: 'Sortie must belong to the same program as the event' });
      }
      maintenanceEvents[eventIndex].sortie_id = sortie.sortie_id;
    }
  }

  // Handle status change to closed
  if (status !== undefined && ['open', 'closed'].includes(status)) {
    maintenanceEvents[eventIndex].status = status;
    if (status === 'closed' && !maintenanceEvents[eventIndex].stop_job) {
      maintenanceEvents[eventIndex].stop_job = new Date().toISOString().split('T')[0];
    }
    if (status === 'open') {
      maintenanceEvents[eventIndex].stop_job = null;
    }
  }

  // Allow explicit stop_job setting
  if (stop_job !== undefined) {
    maintenanceEvents[eventIndex].stop_job = stop_job || null;
  }

  // Handle PQDR flag update
  if (pqdr !== undefined) {
    maintenanceEvents[eventIndex].pqdr = Boolean(pqdr);
    console.log(`[EVENTS] PQDR flag ${pqdr ? 'enabled' : 'disabled'} for event ${event.job_no}`);
  }

  console.log(`[EVENTS] Updated maintenance event ${event.job_no} by ${user.username}`);

  res.json({
    message: 'Maintenance event updated successfully',
    event: maintenanceEvents[eventIndex],
  });
});

// Get repairs for a maintenance event
app.get('/api/events/:eventId/repairs', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Get repairs for this event
  const eventRepairs = repairs.filter(r => r.event_id === eventId);

  // Build reverse lookup for TCTO links to repairs
  // For each repair, find if any TCTO completion is linked to it
  const repairsWithTCTO = eventRepairs.map(repair => {
    let linkedTCTO = null;

    // Search through all TCTO completion data for any that link to this repair
    for (const [tctoId, completionDataArray] of tctoAssetCompletionData.entries()) {
      const linkedCompletion = completionDataArray.find(c => c.linked_repair_id === repair.repair_id);
      if (linkedCompletion) {
        // Found a TCTO linked to this repair
        const tcto = tctoRecords.find(t => t.tcto_id === tctoId);
        if (tcto) {
          linkedTCTO = {
            tcto_id: tcto.tcto_id,
            tcto_no: tcto.tcto_no,
            title: tcto.title,
            status: tcto.status,
            priority: tcto.priority,
            completion_date: linkedCompletion.completion_date,
          };
          break; // Only one TCTO can be linked per repair
        }
      }
    }

    return {
      ...repair,
      linked_tcto: linkedTCTO,
    };
  });

  // Calculate summary
  const summary = {
    total: eventRepairs.length,
    open: eventRepairs.filter(r => r.shop_status === 'open').length,
    closed: eventRepairs.filter(r => r.shop_status === 'closed').length,
  };

  console.log(`[REPAIRS] Fetched ${eventRepairs.length} repairs for event ${event.job_no} by ${user.username}`);

  res.json({
    repairs: repairsWithTCTO,
    summary,
  });
});

// Get single repair by ID
app.get('/api/repairs/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const repairId = parseInt(req.params.id, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  res.json({ repair });
});

// Create a new repair for an event
app.post('/api/events/:eventId/repairs', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can create repairs
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to create repairs.' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Cannot add repairs to closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot add repairs to a closed maintenance event' });
  }

  const { start_date, type_maint, how_mal, when_disc, action_taken, narrative, tag_no, doc_no, micap, chief_review, super_review, repeat_recur, donor_asset_id, eti_in } = req.body;

  // Validate required fields
  if (!type_maint || !narrative) {
    return res.status(400).json({ error: 'Maintenance type and narrative are required' });
  }

  // If action_taken is 'T' (cannibalization), donor_asset_id is required
  if (action_taken === 'T' && !donor_asset_id) {
    return res.status(400).json({ error: 'Donor asset is required for cannibalization (Action T)' });
  }

  // Calculate next repair sequence for this event
  const eventRepairs = repairs.filter(r => r.event_id === eventId);
  const nextSeq = eventRepairs.length > 0 ? Math.max(...eventRepairs.map(r => r.repair_seq)) + 1 : 1;

  // Use provided start_date or default to today
  const repairStartDate = start_date || new Date().toISOString().split('T')[0];

  // Look up donor asset details if cannibalization
  let donorAssetDetails: { donor_asset_sn: string | null; donor_asset_pn: string | null; donor_asset_name: string | null } = {
    donor_asset_sn: null,
    donor_asset_pn: null,
    donor_asset_name: null,
  };

  if (action_taken === 'T' && donor_asset_id) {
    const donorAsset = mockAssets.find(a => a.asset_id === donor_asset_id);
    if (donorAsset) {
      donorAssetDetails = {
        donor_asset_sn: donorAsset.serno,
        donor_asset_pn: donorAsset.partno,
        donor_asset_name: donorAsset.name,
      };

      // Update donor asset status to NMCS (Not Mission Capable - Supply) since a part was cannibalized from it
      const donorAssetIndex = mockAssets.findIndex(a => a.asset_id === donor_asset_id);
      if (donorAssetIndex !== -1) {
        mockAssets[donorAssetIndex].status_cd = 'NMCS';
        console.log(`[CANNIBALIZATION] Donor asset ${donorAsset.serno} status changed to NMCS`);
      }
    }
  }

  const newRepair: Repair = {
    repair_id: repairNextId++,
    event_id: eventId,
    repair_seq: nextSeq,
    asset_id: event.asset_id,
    start_date: repairStartDate,
    stop_date: null,
    type_maint,
    how_mal: how_mal || null,
    when_disc: when_disc || null,
    action_taken: action_taken || null,
    shop_status: 'open',
    narrative,
    tag_no: tag_no || null,
    doc_no: doc_no || null,
    micap: micap === true, // MICAP flag
    micap_login: micap === true ? user.username : null, // Track who set MICAP
    chief_review: chief_review === true, // Chief review flag
    chief_review_by: chief_review === true ? user.username : null, // Track who flagged for chief review
    super_review: super_review === true, // Supervisor review flag
    super_review_by: super_review === true ? user.username : null, // Track who flagged for supervisor review
    repeat_recur: repeat_recur === true, // Repeat/Recur flag
    repeat_recur_by: repeat_recur === true ? user.username : null, // Track who flagged as repeat/recur
    donor_asset_id: action_taken === 'T' ? donor_asset_id : null,
    donor_asset_sn: donorAssetDetails.donor_asset_sn,
    donor_asset_pn: donorAssetDetails.donor_asset_pn,
    donor_asset_name: donorAssetDetails.donor_asset_name,
    // ETI tracking fields
    eti_in: eti_in !== undefined && eti_in !== null && eti_in !== '' ? parseFloat(eti_in) : null,
    eti_out: null, // Set when repair is closed
    eti_delta: null, // Calculated when repair is closed
    created_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  repairs.push(newRepair);

  console.log(`[REPAIRS] Created repair ${newRepair.repair_id} for event ${event.job_no} by ${user.username}`);

  res.status(201).json({
    message: 'Repair created successfully',
    repair: newRepair,
  });
});

// Update a repair
app.put('/api/repairs/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to update repairs.' });
  }

  const repairId = parseInt(req.params.id, 10);
  const repairIndex = repairs.findIndex(r => r.repair_id === repairId);

  if (repairIndex === -1) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const repair = repairs[repairIndex];

  // Get associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  const { type_maint, how_mal, when_disc, action_taken, narrative, tag_no, doc_no, shop_status, stop_date, micap, chief_review, super_review, repeat_recur, donor_asset_id, eti_in, eti_out } = req.body;

  // Update fields
  if (type_maint !== undefined) {
    repairs[repairIndex].type_maint = type_maint;
  }
  if (how_mal !== undefined) {
    repairs[repairIndex].how_mal = how_mal || null;
  }
  if (when_disc !== undefined) {
    repairs[repairIndex].when_disc = when_disc || null;
  }
  if (narrative !== undefined) {
    repairs[repairIndex].narrative = narrative;
  }
  if (tag_no !== undefined) {
    repairs[repairIndex].tag_no = tag_no || null;
  }
  if (doc_no !== undefined) {
    repairs[repairIndex].doc_no = doc_no || null;
  }

  // Handle action_taken update and cannibalization workflow
  if (action_taken !== undefined) {
    const previousActionTaken = repairs[repairIndex].action_taken;
    repairs[repairIndex].action_taken = action_taken || null;

    // If changing to cannibalization (T), require donor asset
    if (action_taken === 'T') {
      if (!donor_asset_id && !repairs[repairIndex].donor_asset_id) {
        return res.status(400).json({ error: 'Donor asset is required for cannibalization (Action T)' });
      }
    }

    // If changing away from cannibalization, clear donor asset fields
    if (previousActionTaken === 'T' && action_taken !== 'T') {
      // Optionally restore donor asset status if needed
      repairs[repairIndex].donor_asset_id = null;
      repairs[repairIndex].donor_asset_sn = null;
      repairs[repairIndex].donor_asset_pn = null;
      repairs[repairIndex].donor_asset_name = null;
    }
  }

  // Handle donor asset update for cannibalization
  if (donor_asset_id !== undefined) {
    const currentActionTaken = action_taken !== undefined ? action_taken : repairs[repairIndex].action_taken;

    if (currentActionTaken === 'T' && donor_asset_id) {
      const donorAsset = mockAssets.find(a => a.asset_id === donor_asset_id);
      if (donorAsset) {
        repairs[repairIndex].donor_asset_id = donor_asset_id;
        repairs[repairIndex].donor_asset_sn = donorAsset.serno;
        repairs[repairIndex].donor_asset_pn = donorAsset.partno;
        repairs[repairIndex].donor_asset_name = donorAsset.name;

        // Update donor asset status to NMCS
        const donorAssetIndex = mockAssets.findIndex(a => a.asset_id === donor_asset_id);
        if (donorAssetIndex !== -1) {
          mockAssets[donorAssetIndex].status_cd = 'NMCS';
          console.log(`[CANNIBALIZATION] Donor asset ${donorAsset.serno} status changed to NMCS`);
        }
      } else {
        return res.status(400).json({ error: 'Donor asset not found' });
      }
    } else if (!currentActionTaken || currentActionTaken !== 'T') {
      // Clear donor asset fields if not cannibalization
      repairs[repairIndex].donor_asset_id = null;
      repairs[repairIndex].donor_asset_sn = null;
      repairs[repairIndex].donor_asset_pn = null;
      repairs[repairIndex].donor_asset_name = null;
    }
  }

  // Handle MICAP flag toggle
  if (micap !== undefined) {
    const previousMicap = repairs[repairIndex].micap;
    repairs[repairIndex].micap = micap === true;
    // Track who set the MICAP flag (only update if changing to true)
    if (micap === true && !previousMicap) {
      repairs[repairIndex].micap_login = user.username;
    }
    // Clear micap_login when turning off MICAP
    if (micap === false) {
      repairs[repairIndex].micap_login = null;
    }
    console.log(`[REPAIRS] MICAP flag ${micap ? 'enabled' : 'disabled'} on repair ${repairId} by ${user.username}`);
  }

  // Handle Chief Review flag toggle
  if (chief_review !== undefined) {
    const previousChiefReview = repairs[repairIndex].chief_review;
    repairs[repairIndex].chief_review = chief_review === true;
    // Track who set the Chief Review flag (only update if changing to true)
    if (chief_review === true && !previousChiefReview) {
      repairs[repairIndex].chief_review_by = user.username;
    }
    // Clear chief_review_by when turning off Chief Review
    if (chief_review === false) {
      repairs[repairIndex].chief_review_by = null;
    }
    console.log(`[REPAIRS] Chief Review flag ${chief_review ? 'enabled' : 'disabled'} on repair ${repairId} by ${user.username}`);
  }

  // Handle supervisor review flag update
  if (super_review !== undefined) {
    const previousSuperReview = repairs[repairIndex].super_review;
    repairs[repairIndex].super_review = super_review === true;
    // Track who set the Supervisor Review flag (only update if changing to true)
    if (super_review === true && !previousSuperReview) {
      repairs[repairIndex].super_review_by = user.username;
    }
    // Clear super_review_by when turning off Supervisor Review
    if (super_review === false) {
      repairs[repairIndex].super_review_by = null;
    }
    console.log(`[REPAIRS] Supervisor Review flag ${super_review ? 'enabled' : 'disabled'} on repair ${repairId} by ${user.username}`);
  }

  // Handle Repeat/Recur flag toggle
  if (repeat_recur !== undefined) {
    const previousRepeatRecur = repairs[repairIndex].repeat_recur;
    repairs[repairIndex].repeat_recur = repeat_recur === true;
    // Track who set the Repeat/Recur flag (only update if changing to true)
    if (repeat_recur === true && !previousRepeatRecur) {
      repairs[repairIndex].repeat_recur_by = user.username;
    }
    // Clear repeat_recur_by when turning off Repeat/Recur
    if (repeat_recur === false) {
      repairs[repairIndex].repeat_recur_by = null;
    }
    console.log(`[REPAIRS] Repeat/Recur flag ${repeat_recur ? 'enabled' : 'disabled'} on repair ${repairId} by ${user.username}`);
  }

  // Handle status change to closed
  if (shop_status !== undefined && ['open', 'closed'].includes(shop_status)) {
    repairs[repairIndex].shop_status = shop_status;
    if (shop_status === 'closed' && !repairs[repairIndex].stop_date) {
      repairs[repairIndex].stop_date = new Date().toISOString().split('T')[0];
    }
    if (shop_status === 'open') {
      repairs[repairIndex].stop_date = null;
    }
  }

  // Allow explicit stop_date setting with validation
  if (stop_date !== undefined) {
    if (stop_date) {
      // Validate stop_date >= start_date
      const startDate = new Date(repairs[repairIndex].start_date);
      const endDate = new Date(stop_date);
      if (endDate < startDate) {
        return res.status(400).json({ error: 'Stop date cannot be before the start date' });
      }
    }
    repairs[repairIndex].stop_date = stop_date || null;
    // Automatically set shop_status to closed when stop_date is set
    if (stop_date) {
      repairs[repairIndex].shop_status = 'closed';
    }
  }

  // Handle ETI In update (can be updated while repair is open)
  if (eti_in !== undefined) {
    repairs[repairIndex].eti_in = eti_in !== null && eti_in !== '' ? parseFloat(eti_in) : null;
  }

  // Handle ETI Out update (typically set when closing repair)
  if (eti_out !== undefined) {
    const parsedEtiOut = eti_out !== null && eti_out !== '' ? parseFloat(eti_out) : null;
    repairs[repairIndex].eti_out = parsedEtiOut;

    // Calculate ETI delta when eti_out is set and eti_in exists
    if (parsedEtiOut !== null && repairs[repairIndex].eti_in !== null) {
      const delta = parsedEtiOut - repairs[repairIndex].eti_in;
      repairs[repairIndex].eti_delta = Math.round(delta * 100) / 100; // Round to 2 decimal places
      console.log(`[REPAIRS] ETI delta calculated: ${repairs[repairIndex].eti_delta} (in: ${repairs[repairIndex].eti_in}, out: ${parsedEtiOut})`);

      // Update the asset's ETI hours if we have a valid delta
      const assetIndex = detailedAssets.findIndex(a => a.asset_id === repairs[repairIndex].asset_id);
      if (assetIndex !== -1 && detailedAssets[assetIndex].eti_hours !== null) {
        // Update asset ETI to the new eti_out value (current meter reading)
        detailedAssets[assetIndex].eti_hours = parsedEtiOut;
        console.log(`[REPAIRS] Asset ${repairs[repairIndex].asset_id} ETI updated to ${parsedEtiOut} hours`);
      }
    } else if (parsedEtiOut === null) {
      repairs[repairIndex].eti_delta = null;
    }
  }

  console.log(`[REPAIRS] Updated repair ${repairId} by ${user.username}`);

  res.json({
    message: 'Repair updated successfully',
    repair: repairs[repairIndex],
  });
});

// Delete a repair
app.delete('/api/repairs/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN and DEPOT_MANAGER can delete repairs
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. Only administrators and depot managers can delete repairs.' });
  }

  const repairId = parseInt(req.params.id, 10);
  const repairIndex = repairs.findIndex(r => r.repair_id === repairId);

  if (repairIndex === -1) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const repair = repairs[repairIndex];

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Cannot delete repairs from closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot delete repairs from a closed maintenance event' });
  }

  // Store repair info for response before deletion
  const deletedRepairInfo = {
    repair_id: repair.repair_id,
    repair_seq: repair.repair_seq,
    event_id: repair.event_id,
    job_no: event.job_no,
  };

  // Remove the repair
  repairs.splice(repairIndex, 1);

  console.log(`[REPAIRS] Deleted repair ${repair.repair_id} (seq ${repair.repair_seq}) from event ${event.job_no} by ${user.username}`);

  res.json({
    message: 'Repair deleted successfully',
    repair: deletedRepairInfo,
  });
});

// ============================================
// INSTALLED PARTS ENDPOINTS
// ============================================

// Get installed parts for a repair
app.get('/api/repairs/:repairId/installed-parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Get installed parts for this repair
  const repairInstalledParts = installedParts.filter(ip => ip.repair_id === repairId);

  console.log(`[INSTALLED_PARTS] Fetched ${repairInstalledParts.length} installed parts for repair ${repairId} by ${user.username}`);

  res.json({
    installed_parts: repairInstalledParts,
    total: repairInstalledParts.length,
  });
});

// Add an installed part to a repair
app.post('/api/repairs/:repairId/installed-parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can add installed parts
  if (!['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to add installed parts.' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Cannot add installed parts to closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot add installed parts to a closed repair' });
  }

  // Cannot add installed parts to closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot add installed parts to a closed maintenance event' });
  }

  const { asset_id, installation_date, installation_notes } = req.body;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Asset ID is required' });
  }

  // Find the asset to get its details
  const asset = mockAssets.find(a => a.asset_id === asset_id);
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if asset belongs to the same program
  if (asset.pgm_id !== event.pgm_id) {
    return res.status(400).json({ error: 'Asset must belong to the same program as the maintenance event' });
  }

  // Check if asset is already installed in this repair
  const existingInstall = installedParts.find(ip => ip.repair_id === repairId && ip.asset_id === asset_id);
  if (existingInstall) {
    return res.status(400).json({ error: 'This asset is already recorded as installed in this repair' });
  }

  // Store previous location before updating
  const previousLocation = asset.location || null;

  // Create the installed part record
  const newInstalledPart: InstalledPart = {
    installed_part_id: installedPartNextId++,
    repair_id: repairId,
    event_id: event.event_id,
    asset_id: asset.asset_id,
    asset_sn: asset.serno,
    asset_pn: asset.partno,
    asset_name: asset.nomen || asset.partno,
    installation_date: installation_date || new Date().toISOString().split('T')[0],
    installation_notes: installation_notes || null,
    previous_location: previousLocation,
    installed_by: user.user_id,
    installed_by_name: user.full_name,
    created_at: new Date().toISOString(),
  };

  installedParts.push(newInstalledPart);

  // Update the asset's location to indicate it's now installed in the maintenance event's asset
  const targetAsset = mockAssets.find(a => a.asset_id === event.asset_id);
  if (targetAsset) {
    asset.location = `Installed in ${targetAsset.serno}`;

    // Also update detailedAssets since that's what the assets API uses
    const detailedAsset = detailedAssets.find(a => a.asset_id === asset.asset_id);
    if (detailedAsset) {
      detailedAsset.location = `Installed in ${targetAsset.serno}`;
    }
  }

  console.log(`[INSTALLED_PARTS] Added installed part (asset ${asset.serno}) to repair ${repairId} by ${user.username}. Previous location: ${previousLocation}`);

  res.status(201).json({
    message: 'Installed part recorded successfully',
    installed_part: newInstalledPart,
  });
});

// Remove an installed part from a repair
app.delete('/api/installed-parts/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN and DEPOT_MANAGER can remove installed parts
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. Only administrators and depot managers can remove installed parts.' });
  }

  const installedPartId = parseInt(req.params.id, 10);
  const installedPartIndex = installedParts.findIndex(ip => ip.installed_part_id === installedPartId);

  if (installedPartIndex === -1) {
    return res.status(404).json({ error: 'Installed part record not found' });
  }

  const installedPart = installedParts[installedPartIndex];

  // Get the repair to check access
  const repair = repairs.find(r => r.repair_id === installedPart.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Associated repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === installedPart.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this installed part record' });
  }

  // Cannot remove installed parts from closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot remove installed parts from a closed maintenance event' });
  }

  // Restore the asset's previous location
  const asset = mockAssets.find(a => a.asset_id === installedPart.asset_id);
  if (asset && installedPart.previous_location) {
    asset.location = installedPart.previous_location;

    // Also update detailedAssets since that's what the assets API uses
    const detailedAsset = detailedAssets.find(a => a.asset_id === installedPart.asset_id);
    if (detailedAsset) {
      detailedAsset.location = installedPart.previous_location;
    }

    console.log(`[INSTALLED_PARTS] Restored asset ${asset.serno} location to: ${installedPart.previous_location}`);
  }

  // Store info for response before deletion
  const deletedInfo = {
    installed_part_id: installedPart.installed_part_id,
    asset_sn: installedPart.asset_sn,
    repair_id: installedPart.repair_id,
  };

  // Remove the installed part record
  installedParts.splice(installedPartIndex, 1);

  console.log(`[INSTALLED_PARTS] Removed installed part ${installedPartId} (asset ${installedPart.asset_sn}) from repair ${installedPart.repair_id} by ${user.username}`);

  res.json({
    message: 'Installed part record removed successfully',
    installed_part: deletedInfo,
  });
});

// Search assets for installation (within the same program)
app.get('/api/events/:eventId/available-assets', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  const searchQuery = (req.query.search as string || '').toLowerCase();

  // Get assets from the same program that are not the event's primary asset
  let availableAssets = mockAssets.filter(a =>
    a.pgm_id === event.pgm_id &&
    a.asset_id !== event.asset_id
  );

  // Apply search filter if provided
  if (searchQuery) {
    availableAssets = availableAssets.filter(a =>
      a.serno.toLowerCase().includes(searchQuery) ||
      a.partno.toLowerCase().includes(searchQuery) ||
      (a.nomen && a.nomen.toLowerCase().includes(searchQuery))
    );
  }

  // Limit results
  const limit = parseInt(req.query.limit as string, 10) || 20;
  availableAssets = availableAssets.slice(0, limit);

  console.log(`[INSTALLED_PARTS] Asset search for event ${event.job_no} by ${user.username} - found ${availableAssets.length} results`);

  res.json({
    assets: availableAssets.map(a => ({
      asset_id: a.asset_id,
      serno: a.serno,
      partno: a.partno,
      nomen: a.nomen,
      status: a.status,
      location: a.location,
    })),
    total: availableAssets.length,
  });
});

// ============================================
// REMOVED PARTS ENDPOINTS
// ============================================

// Get removed parts for a repair
app.get('/api/repairs/:repairId/removed-parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Get removed parts for this repair
  const repairRemovedParts = removedParts.filter(rp => rp.repair_id === repairId);

  console.log(`[REMOVED_PARTS] Fetched ${repairRemovedParts.length} removed parts for repair ${repairId} by ${user.username}`);

  res.json({
    removed_parts: repairRemovedParts,
    total: repairRemovedParts.length,
  });
});

// Add a removed part to a repair
app.post('/api/repairs/:repairId/removed-parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can add removed parts
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to add removed parts.' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Cannot add removed parts to repairs in closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot add removed parts to repairs in closed maintenance events' });
  }

  // Cannot add removed parts to closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot add removed parts to closed repairs' });
  }

  const { asset_id, removal_date, removal_reason, removal_notes, new_status } = req.body;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Asset ID is required' });
  }

  // Find the asset being removed
  const asset = mockAssets.find(a => a.asset_id === asset_id);
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check that asset belongs to the same program
  if (asset.pgm_id !== event.pgm_id) {
    return res.status(400).json({ error: 'Asset must belong to the same program as the maintenance event' });
  }

  // Check if this asset is already removed in this repair
  const existingRemoval = removedParts.find(rp => rp.repair_id === repairId && rp.asset_id === asset_id);
  if (existingRemoval) {
    return res.status(400).json({ error: 'This asset is already listed as removed in this repair' });
  }

  // Use provided removal_date or default to today
  const removalDate = removal_date || new Date().toISOString().split('T')[0];

  const newRemovedPart: RemovedPart = {
    removed_part_id: removedPartNextId++,
    repair_id: repairId,
    event_id: repair.event_id,
    asset_id: asset.asset_id,
    asset_sn: asset.serno,
    asset_pn: asset.partno,
    asset_name: asset.name,
    removal_date: removalDate,
    removal_reason: removal_reason || null,
    removal_notes: removal_notes || null,
    new_status: new_status || null,
    removed_by: user.user_id,
    removed_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString(),
  };

  removedParts.push(newRemovedPart);

  // Optionally update the removed part's asset status if new_status is provided
  if (new_status) {
    const assetIndex = mockAssets.findIndex(a => a.asset_id === asset_id);
    if (assetIndex !== -1) {
      const oldStatus = mockAssets[assetIndex].status_cd;
      mockAssets[assetIndex].status_cd = new_status;
      console.log(`[REMOVED_PARTS] Updated removed asset ${asset.serno} status from ${oldStatus} to ${new_status}`);
    }
  }

  // AUTO-STATUS UPDATE: When a part is removed from a repair, check if the parent asset
  // (the one being repaired) should have its status changed to NMCM
  // This implements the business rule: "Removing parts triggers status update to NMCM"
  const parentAsset = mockAssets.find(a => a.asset_id === event.asset_id);
  const parentDetailedAsset = detailedAssets.find(a => a.asset_id === event.asset_id);
  let statusChanged = false;
  let oldParentStatus = '';

  // Check status from detailedAssets (primary source) or mockAssets (fallback)
  const currentStatus = parentDetailedAsset?.status_cd || parentAsset?.status_cd;

  if (currentStatus === 'FMC') {
    // Parent asset is FMC - removing a part means it's now in maintenance
    oldParentStatus = 'FMC';

    // Update both mockAssets and detailedAssets to ensure consistency
    if (parentAsset) {
      parentAsset.status_cd = 'NMCM';
    }
    if (parentDetailedAsset) {
      parentDetailedAsset.status_cd = 'NMCM';
    }
    statusChanged = true;

    const assetSerno = parentDetailedAsset?.serno || parentAsset?.serno || 'Unknown';
    const assetId = parentDetailedAsset?.asset_id || parentAsset?.asset_id || event.asset_id;
    const pgmId = parentDetailedAsset?.pgm_id || parentAsset?.pgm_id || event.pgm_id;

    console.log(`[REMOVED_PARTS] AUTO-STATUS: Parent asset ${assetSerno} status changed from FMC to NMCM due to part removal`);

    // Add to activity log (audit trail) for the automatic status change
    const now = new Date();
    const statusChangeActivity: ActivityLogEntry = {
      activity_id: 1000 + dynamicActivityLog.length + 1,
      timestamp: now.toISOString(),
      user_id: user.user_id,
      username: user.username,
      user_full_name: `${user.first_name} ${user.last_name}`,
      action_type: 'status_change',
      entity_type: 'asset',
      entity_id: assetId,
      entity_name: assetSerno,
      description: `Auto-status change: ${assetSerno} changed from FMC to NMCM due to part removal (${asset.serno}) in repair #${repairId}`,
      pgm_id: pgmId,
    };
    dynamicActivityLog.push(statusChangeActivity);
  }

  console.log(`[REMOVED_PARTS] Added removed part ${newRemovedPart.removed_part_id} (asset ${asset.serno}) to repair ${repairId} by ${user.username}`);

  // Build response with optional status change info
  const response: any = {
    message: 'Removed part recorded successfully',
    removed_part: newRemovedPart,
  };

  // Include status change info if the parent asset status was updated
  if (statusChanged) {
    const assetSerno = parentDetailedAsset?.serno || parentAsset?.serno || 'Unknown';
    const assetIdForResponse = parentDetailedAsset?.asset_id || parentAsset?.asset_id || event.asset_id;
    response.status_change = {
      asset_id: assetIdForResponse,
      asset_sn: assetSerno,
      old_status: oldParentStatus,
      new_status: 'NMCM',
      message: `Asset ${assetSerno} status automatically changed from ${oldParentStatus} to NMCM due to part removal`,
    };
  }

  res.status(201).json(response);
});

// Delete a removed part record
app.delete('/api/removed-parts/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can delete
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to delete removed parts.' });
  }

  const removedPartId = parseInt(req.params.id, 10);
  const removedPartIndex = removedParts.findIndex(rp => rp.removed_part_id === removedPartId);

  if (removedPartIndex === -1) {
    return res.status(404).json({ error: 'Removed part record not found' });
  }

  const removedPart = removedParts[removedPartIndex];

  // Get the associated repair
  const repair = repairs.find(r => r.repair_id === removedPart.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Associated repair not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this removed part' });
  }

  // Cannot delete removed parts from repairs in closed events
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'Cannot delete removed parts from repairs in closed maintenance events' });
  }

  // Cannot delete removed parts from closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot delete removed parts from closed repairs' });
  }

  const deletedInfo = {
    removed_part_id: removedPart.removed_part_id,
    asset_sn: removedPart.asset_sn,
    repair_id: removedPart.repair_id,
  };

  // Remove the removed part record
  removedParts.splice(removedPartIndex, 1);

  console.log(`[REMOVED_PARTS] Deleted removed part ${removedPartId} (asset ${removedPart.asset_sn}) from repair ${removedPart.repair_id} by ${user.username}`);

  res.json({
    message: 'Removed part record deleted successfully',
    removed_part: deletedInfo,
  });
});

// Search assets for removal (within the same program)
app.get('/api/events/:eventId/removable-assets', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  const searchQuery = (req.query.search as string || '').toLowerCase();

  // Get all assets from the same program (including the event's primary asset - it could be a subcomponent)
  let removableAssets = mockAssets.filter(a => a.pgm_id === event.pgm_id && a.active);

  // Apply search filter if provided
  if (searchQuery) {
    removableAssets = removableAssets.filter(a =>
      a.serno.toLowerCase().includes(searchQuery) ||
      a.partno.toLowerCase().includes(searchQuery) ||
      a.name.toLowerCase().includes(searchQuery)
    );
  }

  // Limit results
  const limit = parseInt(req.query.limit as string, 10) || 20;
  removableAssets = removableAssets.slice(0, limit);

  console.log(`[REMOVED_PARTS] Asset search for event ${event.job_no} by ${user.username} - found ${removableAssets.length} results`);

  res.json({
    assets: removableAssets.map(a => ({
      asset_id: a.asset_id,
      serno: a.serno,
      partno: a.partno,
      name: a.name,
      status_cd: a.status_cd,
      admin_loc: a.admin_loc,
    })),
    total: removableAssets.length,
  });
});

// ============================================
// LABOR RECORD ENDPOINTS
// ============================================

// Get labor records for a repair
app.get('/api/repairs/:repairId/labor', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get associated event for program access check
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Get labor records for this repair
  const repairLabor = laborRecords.filter(l => l.repair_id === repairId);

  // Calculate summary
  const summary = {
    total: repairLabor.length,
    total_hours: repairLabor.reduce((sum, l) => sum + (l.hours || 0), 0),
  };

  console.log(`[LABOR] Fetched ${repairLabor.length} labor records for repair ${repairId} by ${user.username}`);

  res.json({
    labor: repairLabor,
    summary,
  });
});

// Get single labor record by ID
app.get('/api/labor/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const laborId = parseInt(req.params.id, 10);
  const labor = laborRecords.find(l => l.labor_id === laborId);

  if (!labor) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  // Get associated repair and event for program access check
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Associated repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor record' });
  }

  res.json(labor);
});

// Create a new labor record for a repair
app.post('/api/repairs/:repairId/labor', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can create labor
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to create labor records.' });
  }

  const repairId = parseInt(req.params.repairId, 10);
  const repair = repairs.find(r => r.repair_id === repairId);

  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  // Get associated event for program access check
  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this repair' });
  }

  // Cannot add labor to closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot add labor records to a closed repair' });
  }

  const {
    action_taken,
    how_mal,
    when_disc,
    type_maint,
    cat_labor,
    start_date,
    stop_date,
    hours,
    crew_chief,
    crew_size,
    corrective,
    discrepancy,
    remarks,
    corrected_by,
    inspected_by,
    bit_log,
  } = req.body;

  // Validate required fields
  if (!crew_chief) {
    return res.status(400).json({ error: 'Crew chief name is required' });
  }

  // Corrective action narrative is required
  if (!corrective || !corrective.trim()) {
    return res.status(400).json({ error: 'Corrective action narrative is required' });
  }

  // Calculate next labor sequence for this repair
  const repairLabor = laborRecords.filter(l => l.repair_id === repairId);
  const nextSeq = repairLabor.length > 0 ? Math.max(...repairLabor.map(l => l.labor_seq)) + 1 : 1;

  // Use provided start_date or default to today
  const laborStartDate = start_date || new Date().toISOString().split('T')[0];

  // Validate stop_date if provided
  if (stop_date) {
    const startDateObj = new Date(laborStartDate);
    const stopDateObj = new Date(stop_date);
    if (stopDateObj < startDateObj) {
      return res.status(400).json({ error: 'Stop time cannot be before start time' });
    }
  }

  const newLabor: Labor = {
    labor_id: laborNextId++,
    repair_id: repairId,
    labor_seq: nextSeq,
    asset_id: repair.asset_id,
    action_taken: action_taken || null,
    how_mal: how_mal || null,
    when_disc: when_disc || null,
    type_maint: type_maint || null,
    cat_labor: cat_labor || null,
    start_date: laborStartDate,
    stop_date: stop_date || null,
    hours: hours !== undefined && hours !== null && hours !== '' ? parseFloat(hours) : null,
    crew_chief: crew_chief,
    crew_size: crew_size !== undefined && crew_size !== null && crew_size !== '' ? parseInt(crew_size, 10) : null,
    corrective: corrective || null,
    discrepancy: discrepancy || null,
    remarks: remarks || null,
    corrected_by: corrected_by || null,
    inspected_by: inspected_by || null,
    bit_log: bit_log || null,
    sent_imds: false,
    valid: true,
    created_by: user.user_id,
    created_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString(),
  };

  laborRecords.push(newLabor);

  console.log(`[LABOR] Created labor ${newLabor.labor_id} (seq ${newLabor.labor_seq}) for repair ${repairId} by ${user.username}`);

  res.status(201).json({
    message: 'Labor record created successfully',
    labor: newLabor,
  });
});

// Update a labor record
app.put('/api/labor/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to update labor records.' });
  }

  const laborId = parseInt(req.params.id, 10);
  const laborIndex = laborRecords.findIndex(l => l.labor_id === laborId);

  if (laborIndex === -1) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  const labor = laborRecords[laborIndex];

  // Get associated repair for access check
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Associated repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor record' });
  }

  // Cannot update labor on closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot update labor records on a closed repair' });
  }

  const {
    action_taken,
    how_mal,
    when_disc,
    type_maint,
    cat_labor,
    start_date,
    stop_date,
    hours,
    crew_chief,
    crew_size,
    corrective,
    discrepancy,
    remarks,
    corrected_by,
    inspected_by,
    bit_log,
  } = req.body;

  // Validate corrective action is provided if it's being updated or if the record doesn't have one
  if (corrective !== undefined && (!corrective || !corrective.trim())) {
    return res.status(400).json({ error: 'Corrective action narrative is required' });
  }

  // Update fields if provided
  if (action_taken !== undefined) laborRecords[laborIndex].action_taken = action_taken || null;
  if (how_mal !== undefined) laborRecords[laborIndex].how_mal = how_mal || null;
  if (when_disc !== undefined) laborRecords[laborIndex].when_disc = when_disc || null;
  if (type_maint !== undefined) laborRecords[laborIndex].type_maint = type_maint || null;
  if (cat_labor !== undefined) laborRecords[laborIndex].cat_labor = cat_labor || null;
  if (start_date !== undefined) laborRecords[laborIndex].start_date = start_date;
  if (stop_date !== undefined) laborRecords[laborIndex].stop_date = stop_date || null;
  if (hours !== undefined) laborRecords[laborIndex].hours = hours !== null && hours !== '' ? parseFloat(hours) : null;
  if (crew_chief !== undefined) laborRecords[laborIndex].crew_chief = crew_chief || null;
  if (crew_size !== undefined) laborRecords[laborIndex].crew_size = crew_size !== null && crew_size !== '' ? parseInt(crew_size, 10) : null;
  if (corrective !== undefined) laborRecords[laborIndex].corrective = corrective || null;
  if (discrepancy !== undefined) laborRecords[laborIndex].discrepancy = discrepancy || null;
  if (remarks !== undefined) laborRecords[laborIndex].remarks = remarks || null;
  if (corrected_by !== undefined) laborRecords[laborIndex].corrected_by = corrected_by || null;
  if (inspected_by !== undefined) laborRecords[laborIndex].inspected_by = inspected_by || null;
  if (bit_log !== undefined) laborRecords[laborIndex].bit_log = bit_log || null;

  // Validate stop_date if provided
  if (stop_date && laborRecords[laborIndex].start_date) {
    const startDateObj = new Date(laborRecords[laborIndex].start_date);
    const stopDateObj = new Date(stop_date);
    if (stopDateObj < startDateObj) {
      return res.status(400).json({ error: 'Stop time cannot be before start time' });
    }
  }

  console.log(`[LABOR] Updated labor ${laborId} by ${user.username}`);

  res.json({
    message: 'Labor record updated successfully',
    labor: laborRecords[laborIndex],
  });
});

// Delete a labor record
app.delete('/api/labor/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN and DEPOT_MANAGER can delete labor records
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. Only administrators and depot managers can delete labor records.' });
  }

  const laborId = parseInt(req.params.id, 10);
  const laborIndex = laborRecords.findIndex(l => l.labor_id === laborId);

  if (laborIndex === -1) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  const labor = laborRecords[laborIndex];

  // Get the associated repair for access check
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Associated repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor record' });
  }

  // Cannot delete labor from closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot delete labor records from a closed repair' });
  }

  const deletedInfo = {
    labor_id: labor.labor_id,
    labor_seq: labor.labor_seq,
    repair_id: labor.repair_id,
  };

  // Remove the labor record
  laborRecords.splice(laborIndex, 1);

  console.log(`[LABOR] Deleted labor ${laborId} (seq ${labor.labor_seq}) from repair ${labor.repair_id} by ${user.username}`);

  res.json({
    message: 'Labor record deleted successfully',
    labor: deletedInfo,
  });
});

// ============================================
// LABOR PARTS ENDPOINTS
// ============================================

// LaborPart interface for tracking parts worked on, removed, installed within labor
interface LaborPart {
  labor_part_id: number;
  labor_id: number;
  asset_id: number | null;
  partno_id: number | null;
  partno: string | null;
  part_name: string | null;
  serial_number: string | null;
  part_action: 'WORKED' | 'REMOVED' | 'INSTALLED';
  qty: number;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

// Persistent storage for labor parts
let laborParts: LaborPart[] = [];
let laborPartNextId = 1;

// Initialize labor parts with sample data
function initializeLaborParts(): void {
  laborParts = [
    {
      labor_part_id: 1,
      labor_id: 1,
      asset_id: null,
      partno_id: 9,
      partno: 'PN-POWER-MOD',
      part_name: 'Power Module',
      serial_number: null,
      part_action: 'WORKED',
      qty: 1,
      created_by: 3,
      created_by_name: 'Bob Field',
      created_at: new Date().toISOString().split('T')[0],
    },
    {
      labor_part_id: 2,
      labor_id: 1,
      asset_id: null,
      partno_id: 8,
      partno: 'PN-COMM-SYS',
      part_name: 'Communication System',
      serial_number: 'SN-CONN-001',
      part_action: 'REMOVED',
      qty: 1,
      created_by: 3,
      created_by_name: 'Bob Field',
      created_at: new Date().toISOString().split('T')[0],
    },
    {
      labor_part_id: 3,
      labor_id: 1,
      asset_id: null,
      partno_id: 8,
      partno: 'PN-COMM-SYS',
      part_name: 'Communication System',
      serial_number: 'SN-CONN-002',
      part_action: 'INSTALLED',
      qty: 1,
      created_by: 3,
      created_by_name: 'Bob Field',
      created_at: new Date().toISOString().split('T')[0],
    },
  ];
  laborPartNextId = 4;
}

// Initialize labor parts on server start
initializeLaborParts();

// Get labor parts for a specific labor record
app.get('/api/labor/:laborId/parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const laborId = parseInt(req.params.laborId, 10);
  const labor = laborRecords.find(l => l.labor_id === laborId);

  if (!labor) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  // Find the repair and event to check program access
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor record' });
  }

  // Get labor parts for this labor record
  const parts = laborParts.filter(lp => lp.labor_id === laborId);

  // Categorize by action
  const worked = parts.filter(p => p.part_action === 'WORKED');
  const removed = parts.filter(p => p.part_action === 'REMOVED');
  const installed = parts.filter(p => p.part_action === 'INSTALLED');

  console.log(`[LABOR_PARTS] Fetched ${parts.length} parts for labor ${laborId} by ${user.username}`);

  res.json({
    parts,
    summary: {
      worked: worked.length,
      removed: removed.length,
      installed: installed.length,
      total: parts.length,
    },
  });
});

// Add a part to a labor record
app.post('/api/labor/:laborId/parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to add parts to labor records.' });
  }

  const laborId = parseInt(req.params.laborId, 10);
  const labor = laborRecords.find(l => l.labor_id === laborId);

  if (!labor) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  // Find the repair and event to check program access and status
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor record' });
  }

  // Cannot add parts to closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot add parts to a closed repair' });
  }

  const { part_action, partno, part_name, serial_number, qty, partno_id, asset_id } = req.body;

  // Validate part_action
  const validActions = ['WORKED', 'REMOVED', 'INSTALLED'];
  if (!part_action || !validActions.includes(part_action)) {
    return res.status(400).json({ error: 'Invalid part action. Must be WORKED, REMOVED, or INSTALLED.' });
  }

  // Validate required fields
  if (!partno && !part_name) {
    return res.status(400).json({ error: 'Part number or part name is required.' });
  }

  const newLaborPart: LaborPart = {
    labor_part_id: laborPartNextId++,
    labor_id: laborId,
    asset_id: asset_id || null,
    partno_id: partno_id || null,
    partno: partno || null,
    part_name: part_name || null,
    serial_number: serial_number || null,
    part_action,
    qty: qty || 1,
    created_by: user.user_id,
    created_by_name: `${user.first_name} ${user.last_name}`,
    created_at: new Date().toISOString().split('T')[0],
  };

  laborParts.push(newLaborPart);

  console.log(`[LABOR_PARTS] Added ${part_action} part "${partno || part_name}" to labor ${laborId} by ${user.username}`);

  // Auto-PMI creation for ECU part actions
  let autoPMICreated: PMIRecord | null = null;
  const partNameLower = (part_name || '').toLowerCase();
  const partnoLower = (partno || '').toLowerCase();
  const isECUPart = partNameLower.includes('ecu') || partnoLower.includes('ecu');

  if (isECUPart) {
    // Get the asset from the maintenance event to create the PMI for
    const eventAsset = detailedAssets.find(a => a.asset_id === event.asset_id);

    if (eventAsset) {
      // Calculate due date (30 days from today for ECU inspection)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const dueDateStr = dueDate.toISOString().split('T')[0];
      const daysUntilDue = 30;

      // Create auto-PMI for ECU part action
      const autoPMI: PMIRecord = {
        pmi_id: nextCustomPMIId++,
        asset_id: eventAsset.asset_id,
        asset_sn: eventAsset.serno,
        asset_name: eventAsset.part_name || eventAsset.partno || 'Unknown',
        pmi_type: `ECU Post-Action Inspection (${part_action})`,
        wuc_cd: eventAsset.partno?.substring(0, 5) || '',
        next_due_date: dueDateStr,
        days_until_due: daysUntilDue,
        completed_date: null,
        pgm_id: eventAsset.pgm_id,
        status: 'upcoming',
        interval_days: 30,
      };

      customPMIRecords.push(autoPMI);
      autoPMICreated = autoPMI;

      console.log(`[PMI] Auto-created PMI #${autoPMI.pmi_id} for ECU part action - Asset: ${eventAsset.serno}, Due: ${dueDateStr}`);
    }
  }

  res.status(201).json({
    message: `Part ${part_action.toLowerCase()} added successfully${autoPMICreated ? '. Auto-PMI created for ECU part action.' : ''}`,
    part: newLaborPart,
    auto_pmi: autoPMICreated,
  });
});

// Update a labor part
app.put('/api/labor-parts/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to update labor parts.' });
  }

  const partId = parseInt(req.params.id, 10);
  const partIndex = laborParts.findIndex(lp => lp.labor_part_id === partId);

  if (partIndex === -1) {
    return res.status(404).json({ error: 'Labor part not found' });
  }

  const laborPart = laborParts[partIndex];
  const labor = laborRecords.find(l => l.labor_id === laborPart.labor_id);

  if (!labor) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  // Find the repair and event to check program access and status
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor part' });
  }

  // Cannot update parts on closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot update parts on a closed repair' });
  }

  const { part_action, partno, part_name, serial_number, qty, partno_id, asset_id } = req.body;

  // Update fields
  if (part_action !== undefined) {
    const validActions = ['WORKED', 'REMOVED', 'INSTALLED'];
    if (!validActions.includes(part_action)) {
      return res.status(400).json({ error: 'Invalid part action. Must be WORKED, REMOVED, or INSTALLED.' });
    }
    laborParts[partIndex].part_action = part_action;
  }
  if (partno !== undefined) laborParts[partIndex].partno = partno || null;
  if (part_name !== undefined) laborParts[partIndex].part_name = part_name || null;
  if (serial_number !== undefined) laborParts[partIndex].serial_number = serial_number || null;
  if (qty !== undefined) laborParts[partIndex].qty = qty || 1;
  if (partno_id !== undefined) laborParts[partIndex].partno_id = partno_id || null;
  if (asset_id !== undefined) laborParts[partIndex].asset_id = asset_id || null;

  console.log(`[LABOR_PARTS] Updated part ${partId} on labor ${laborPart.labor_id} by ${user.username}`);

  res.json({
    message: 'Labor part updated successfully',
    part: laborParts[partIndex],
  });
});

// Delete a labor part
app.delete('/api/labor-parts/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN and DEPOT_MANAGER can delete
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. Only administrators and depot managers can delete labor parts.' });
  }

  const partId = parseInt(req.params.id, 10);
  const partIndex = laborParts.findIndex(lp => lp.labor_part_id === partId);

  if (partIndex === -1) {
    return res.status(404).json({ error: 'Labor part not found' });
  }

  const laborPart = laborParts[partIndex];
  const labor = laborRecords.find(l => l.labor_id === laborPart.labor_id);

  if (!labor) {
    return res.status(404).json({ error: 'Labor record not found' });
  }

  // Find the repair and event to check program access and status
  const repair = repairs.find(r => r.repair_id === labor.repair_id);
  if (!repair) {
    return res.status(404).json({ error: 'Repair not found' });
  }

  const event = maintenanceEvents.find(e => e.event_id === repair.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this labor part' });
  }

  // Cannot delete parts from closed repairs
  if (repair.shop_status === 'closed') {
    return res.status(400).json({ error: 'Cannot delete parts from a closed repair' });
  }

  const deletedPart = laborParts[partIndex];
  laborParts.splice(partIndex, 1);

  console.log(`[LABOR_PARTS] Deleted ${deletedPart.part_action} part "${deletedPart.partno || deletedPart.part_name}" from labor ${laborPart.labor_id} by ${user.username}`);

  res.json({
    message: 'Labor part deleted successfully',
    part: deletedPart,
  });
});

// ============================================
// ATTACHMENT ENDPOINTS
// ============================================

// Get attachments for a maintenance event
app.get('/api/events/:eventId/attachments', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Get attachments for this event
  const eventAttachments = attachments.filter(a => a.event_id === eventId);

  console.log(`[ATTACHMENTS] Fetched ${eventAttachments.length} attachments for event ${event.job_no} by ${user.username}`);

  res.json({
    attachments: eventAttachments,
    total: eventAttachments.length,
  });
});

// Upload attachment to a maintenance event
app.post('/api/events/:eventId/attachments', upload.single('file'), (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can upload
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to upload attachments.' });
  }

  const eventId = parseInt(req.params.eventId, 10);
  const event = maintenanceEvents.find(e => e.event_id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { description } = req.body;

  const newAttachment: Attachment = {
    attachment_id: attachmentNextId++,
    event_id: eventId,
    filename: req.file.filename,
    original_filename: req.file.originalname,
    file_path: req.file.path,
    file_size: req.file.size,
    mime_type: req.file.mimetype,
    uploaded_by: user.user_id,
    uploaded_by_name: `${user.first_name} ${user.last_name}`,
    uploaded_at: new Date().toISOString(),
    description: description || null,
  };

  attachments.push(newAttachment);

  console.log(`[ATTACHMENTS] Uploaded attachment ${newAttachment.attachment_id} (${newAttachment.original_filename}) for event ${event.job_no} by ${user.username}`);

  res.status(201).json({
    message: 'Attachment uploaded successfully',
    attachment: newAttachment,
  });
});

// Download/serve an attachment
app.get('/api/attachments/:id/download', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const attachmentId = parseInt(req.params.id, 10);
  const attachment = attachments.find(a => a.attachment_id === attachmentId);

  if (!attachment) {
    return res.status(404).json({ error: 'Attachment not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === attachment.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this attachment' });
  }

  // Check if file exists
  if (!fs.existsSync(attachment.file_path)) {
    return res.status(404).json({ error: 'File not found on server' });
  }

  console.log(`[ATTACHMENTS] Serving attachment ${attachmentId} (${attachment.original_filename}) to ${user.username}`);

  // Set appropriate headers for download
  res.setHeader('Content-Type', attachment.mime_type);
  res.setHeader('Content-Disposition', `attachment; filename="${attachment.original_filename}"`);
  res.setHeader('Content-Length', attachment.file_size);

  // Stream the file
  const fileStream = fs.createReadStream(attachment.file_path);
  fileStream.pipe(res);
});

// Serve attachment for inline viewing (images)
app.get('/api/attachments/:id/view', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const attachmentId = parseInt(req.params.id, 10);
  const attachment = attachments.find(a => a.attachment_id === attachmentId);

  if (!attachment) {
    return res.status(404).json({ error: 'Attachment not found' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === attachment.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this attachment' });
  }

  // Check if file exists
  if (!fs.existsSync(attachment.file_path)) {
    return res.status(404).json({ error: 'File not found on server' });
  }

  console.log(`[ATTACHMENTS] Viewing attachment ${attachmentId} (${attachment.original_filename}) by ${user.username}`);

  // Set appropriate headers for inline viewing
  res.setHeader('Content-Type', attachment.mime_type);
  res.setHeader('Content-Disposition', `inline; filename="${attachment.original_filename}"`);
  res.setHeader('Content-Length', attachment.file_size);

  // Stream the file
  const fileStream = fs.createReadStream(attachment.file_path);
  fileStream.pipe(res);
});

// Delete an attachment
app.delete('/api/attachments/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN, DEPOT_MANAGER can delete (or the user who uploaded)
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER'];

  const attachmentId = parseInt(req.params.id, 10);
  const attachmentIndex = attachments.findIndex(a => a.attachment_id === attachmentId);

  if (attachmentIndex === -1) {
    return res.status(404).json({ error: 'Attachment not found' });
  }

  const attachment = attachments[attachmentIndex];

  // Allow delete if: admin, depot_manager, or the uploader
  if (!allowedRoles.includes(user.role) && attachment.uploaded_by !== user.user_id) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to delete this attachment.' });
  }

  // Get the associated event to check program access
  const event = maintenanceEvents.find(e => e.event_id === attachment.event_id);
  if (!event) {
    return res.status(404).json({ error: 'Associated maintenance event not found' });
  }

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this attachment' });
  }

  // Delete the file from disk
  if (fs.existsSync(attachment.file_path)) {
    fs.unlinkSync(attachment.file_path);
  }

  // Remove from array
  attachments.splice(attachmentIndex, 1);

  console.log(`[ATTACHMENTS] Deleted attachment ${attachmentId} (${attachment.original_filename}) by ${user.username}`);

  res.json({
    message: 'Attachment deleted successfully',
    deleted_attachment: {
      attachment_id: attachment.attachment_id,
      original_filename: attachment.original_filename,
    },
  });
});

// Close a maintenance event with validation
app.post('/api/events/:id/close', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions
  const allowedRoles = ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'];
  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: 'Access denied. You do not have permission to close maintenance events.' });
  }

  const eventId = parseInt(req.params.id, 10);
  const eventIndex = maintenanceEvents.findIndex(e => e.event_id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  const event = maintenanceEvents[eventIndex];

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Check if event is already closed
  if (event.status === 'closed') {
    return res.status(400).json({ error: 'This maintenance event is already closed' });
  }

  // Check if all repairs are closed
  const eventRepairs = repairs.filter(r => r.event_id === eventId);
  const openRepairs = eventRepairs.filter(r => r.shop_status === 'open');

  if (openRepairs.length > 0) {
    return res.status(400).json({
      error: `Cannot close event: ${openRepairs.length} repair(s) are still open. All repairs must be closed before closing the maintenance event.`,
      open_repairs: openRepairs.map(r => ({
        repair_id: r.repair_id,
        repair_seq: r.repair_seq,
        narrative: r.narrative.substring(0, 50) + (r.narrative.length > 50 ? '...' : ''),
      })),
    });
  }

  // Get stop_job from request or default to today
  const { stop_job } = req.body;
  const closingDate = stop_job || new Date().toISOString().split('T')[0];

  // Close the event
  maintenanceEvents[eventIndex].status = 'closed';
  maintenanceEvents[eventIndex].stop_job = closingDate;

  console.log(`[EVENTS] Closed maintenance event ${event.job_no} by ${user.username}`);

  res.json({
    message: 'Maintenance event closed successfully',
    event: maintenanceEvents[eventIndex],
  });
});

// Delete a maintenance event (ADMIN only)
app.delete('/api/events/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role permissions - only ADMIN can delete events
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Only administrators can delete maintenance events.' });
  }

  const eventId = parseInt(req.params.id, 10);
  const eventIndex = maintenanceEvents.findIndex(e => e.event_id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Maintenance event not found' });
  }

  const event = maintenanceEvents[eventIndex];

  // Check if user has access to this event's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(event.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this maintenance event' });
  }

  // Check for related repairs
  const eventRepairs = repairs.filter(r => r.event_id === eventId);

  if (eventRepairs.length > 0) {
    // Cascade delete: remove all repairs associated with this event
    const repairIds = eventRepairs.map(r => r.repair_id);
    for (const repairId of repairIds) {
      const repairIndex = repairs.findIndex(r => r.repair_id === repairId);
      if (repairIndex !== -1) {
        repairs.splice(repairIndex, 1);
      }
    }
    console.log(`[EVENTS] Cascade deleted ${eventRepairs.length} repairs for event ${event.job_no}`);
  }

  // Remove the event
  const deletedEvent = maintenanceEvents.splice(eventIndex, 1)[0];

  console.log(`[EVENTS] Deleted maintenance event ${event.job_no} by ${user.username}`);

  res.json({
    message: 'Maintenance event deleted successfully',
    event: {
      event_id: deletedEvent.event_id,
      job_no: deletedEvent.job_no,
      asset_sn: deletedEvent.asset_sn,
      asset_name: deletedEvent.asset_name,
    },
    repairs_deleted: eventRepairs.length,
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

  // Check both generated and custom PMI records
  const generatedPMI = generateMockPMIData();
  let pmi = generatedPMI.find(p => p.pmi_id === pmiId);

  // If not in generated, check custom records
  if (!pmi) {
    pmi = customPMIRecords.find(p => p.pmi_id === pmiId);
  }

  if (!pmi) {
    return res.status(404).json({ error: 'PMI record not found' });
  }

  // Update days_until_due dynamically
  const daysUntilDue = calculateDaysUntilDue(pmi.next_due_date);
  const updatedPmi = {
    ...pmi,
    days_until_due: daysUntilDue,
    status: pmi.completed_date ? 'completed' as const : getPMIStatus(daysUntilDue),
  };

  // Check if user has access to this PMI's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(updatedPmi.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this PMI record' });
  }

  res.json({ pmi: updatedPmi });
});

// Update PMI record
app.put('/api/pmi/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check permissions - only depot_manager and admin can edit PMI
  if (!['DEPOT_MANAGER', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Only depot managers and admins can edit PMI records' });
  }

  const pmiId = parseInt(req.params.id, 10);
  const { pmi_type, next_due_date, wuc_cd, completed_date } = req.body;

  // Check both generated and custom PMI records
  const generatedPMI = generateMockPMIData();
  let pmi = generatedPMI.find(p => p.pmi_id === pmiId);
  let isCustom = false;
  let customIndex = -1;

  // If not in generated, check custom records
  if (!pmi) {
    customIndex = customPMIRecords.findIndex(p => p.pmi_id === pmiId);
    if (customIndex !== -1) {
      pmi = customPMIRecords[customIndex];
      isCustom = true;
    }
  }

  if (!pmi) {
    return res.status(404).json({ error: 'PMI record not found' });
  }

  // Check if user has access to this PMI's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(pmi.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this PMI record' });
  }

  // Validate fields if provided
  if (pmi_type !== undefined && pmi_type.trim() === '') {
    return res.status(400).json({ error: 'PMI type cannot be empty' });
  }

  // Calculate new days until due if date changed
  const newDueDate = next_due_date || pmi.next_due_date;
  const daysUntilDue = calculateDaysUntilDue(newDueDate);

  // Create updated PMI record
  const updatedPMI: PMIRecord = {
    ...pmi,
    pmi_type: pmi_type !== undefined ? pmi_type.trim() : pmi.pmi_type,
    next_due_date: newDueDate,
    wuc_cd: wuc_cd !== undefined ? (wuc_cd?.trim() || '') : pmi.wuc_cd,
    completed_date: completed_date !== undefined ? completed_date : pmi.completed_date,
    days_until_due: daysUntilDue,
    status: (completed_date !== undefined ? completed_date : pmi.completed_date)
      ? 'completed' as const
      : getPMIStatus(daysUntilDue),
  };

  // For generated PMI records, we need to store the modifications
  // We'll add/update in customPMIRecords as an override
  if (isCustom) {
    customPMIRecords[customIndex] = updatedPMI;
  } else {
    // For generated PMI, add to custom records as override (remove any existing override first)
    const existingOverrideIndex = customPMIRecords.findIndex(p => p.pmi_id === pmiId);
    if (existingOverrideIndex !== -1) {
      customPMIRecords[existingOverrideIndex] = updatedPMI;
    } else {
      customPMIRecords.push(updatedPMI);
    }
  }

  console.log(`[PMI] Updated PMI #${updatedPMI.pmi_id} by ${user.username} - Type: ${updatedPMI.pmi_type}, Due: ${updatedPMI.next_due_date}`);

  res.json({
    message: 'PMI record updated successfully',
    pmi: updatedPMI,
  });
});

// Complete PMI - marks as completed and schedules next occurrence
app.post('/api/pmi/:id/complete', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Field technicians can complete PMI (they do the work)
  if (!['FIELD_TECHNICIAN', 'DEPOT_MANAGER', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Only field technicians, depot managers, and admins can complete PMI records' });
  }

  const pmiId = parseInt(req.params.id, 10);
  const { completion_date, linked_event_id } = req.body;

  // Validate completion date
  if (!completion_date) {
    return res.status(400).json({ error: 'Completion date is required' });
  }

  // Check both generated and custom PMI records
  const generatedPMI = generateMockPMIData();
  let pmi = generatedPMI.find(p => p.pmi_id === pmiId);
  let isCustom = false;
  let customIndex = -1;

  // If not in generated, check custom records
  if (!pmi) {
    customIndex = customPMIRecords.findIndex(p => p.pmi_id === pmiId);
    if (customIndex !== -1) {
      pmi = customPMIRecords[customIndex];
      isCustom = true;
    }
  }

  if (!pmi) {
    return res.status(404).json({ error: 'PMI record not found' });
  }

  // Check if user has access to this PMI's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(pmi.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this PMI record' });
  }

  // Validate linked_event_id if provided
  if (linked_event_id !== undefined && linked_event_id !== null) {
    const eventExists = maintenanceEvents.find(e => e.event_id === linked_event_id);
    if (!eventExists) {
      return res.status(400).json({ error: 'Invalid maintenance event ID' });
    }
  }

  // Calculate next due date based on completion date + interval
  const completionDateObj = new Date(completion_date);
  completionDateObj.setDate(completionDateObj.getDate() + pmi.interval_days);
  const nextDueDate = completionDateObj.toISOString().split('T')[0];
  const daysUntilDue = calculateDaysUntilDue(nextDueDate);

  // Create completed PMI record with next due date calculated
  const completedPMI: PMIRecord & { linked_event_id?: number | null } = {
    ...pmi,
    completed_date: completion_date,
    next_due_date: nextDueDate,
    days_until_due: daysUntilDue,
    status: getPMIStatus(daysUntilDue), // Reset to active status with new due date
    linked_event_id: linked_event_id || null,
  };

  // Store the completed/updated PMI
  if (isCustom) {
    customPMIRecords[customIndex] = completedPMI;
  } else {
    // For generated PMI, add to custom records as override
    const existingOverrideIndex = customPMIRecords.findIndex(p => p.pmi_id === pmiId);
    if (existingOverrideIndex !== -1) {
      customPMIRecords[existingOverrideIndex] = completedPMI;
    } else {
      customPMIRecords.push(completedPMI);
    }
  }

  console.log(`[PMI] Completed PMI #${completedPMI.pmi_id} by ${user.username} on ${completion_date} - Next due: ${nextDueDate}`);
  if (linked_event_id) {
    console.log(`[PMI] PMI #${completedPMI.pmi_id} linked to Maintenance Event #${linked_event_id}`);
  }

  res.json({
    message: 'PMI completed successfully',
    pmi: completedPMI,
    next_due_date: nextDueDate,
  });
});

// Get PMI history for a specific asset
app.get('/api/assets/:id/pmi-history', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);
  if (isNaN(assetId)) {
    return res.status(400).json({ error: 'Invalid asset ID' });
  }

  // Find the asset
  const asset = mockAssets.find(a => a.asset_id === assetId);
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get all PMI records (generated + custom) for this asset
  const generatedPMI = generateMockPMIData();
  const customPMIIds = new Set(customPMIRecords.map(p => p.pmi_id));
  const filteredGeneratedPMI = generatedPMI.filter(p => !customPMIIds.has(p.pmi_id));
  const allPMI = [...filteredGeneratedPMI, ...customPMIRecords];

  // Filter to only this asset's PMI records
  let assetPMI = allPMI.filter(pmi => pmi.asset_id === assetId);

  // Update days_until_due and status dynamically
  assetPMI = assetPMI.map(pmi => {
    const daysUntilDue = calculateDaysUntilDue(pmi.next_due_date);
    return {
      ...pmi,
      days_until_due: daysUntilDue,
      status: pmi.completed_date ? 'completed' as const : getPMIStatus(daysUntilDue),
    };
  });

  // Sort by next_due_date (most recent first for history view)
  assetPMI.sort((a, b) => new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime());

  // Calculate summary for this asset
  const summary = {
    total: assetPMI.length,
    completed: assetPMI.filter(p => p.completed_date).length,
    pending: assetPMI.filter(p => !p.completed_date).length,
    overdue: assetPMI.filter(p => !p.completed_date && p.days_until_due < 0).length,
    due_soon: assetPMI.filter(p => !p.completed_date && p.days_until_due >= 0 && p.days_until_due <= 7).length,
    upcoming: assetPMI.filter(p => !p.completed_date && p.days_until_due > 7 && p.days_until_due <= 30).length,
  };

  console.log(`[PMI History] Retrieved ${assetPMI.length} PMI records for asset ${asset.serno} by ${user.username}`);

  res.json({
    pmi_history: assetPMI,
    summary,
    asset: {
      asset_id: asset.asset_id,
      serno: asset.serno,
      name: asset.name || asset.part_name,
    },
  });
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
  // Additional fields for asset detail view
  uii: string | null;  // Unique Item Identifier
  mfg_date: string | null;  // Manufacturing date
  acceptance_date: string | null;  // Acceptance date
  admin_loc: string;  // Administrative location code
  admin_loc_name: string;  // Administrative location name
  cust_loc: string;  // Custodial location code
  cust_loc_name: string;  // Custodial location name
  // NHA/SRA hierarchy fields
  nha_asset_id: number | null;  // Next Higher Assembly - parent asset ID
  // In-transit shipping information
  carrier: string | null;  // Shipping carrier (e.g., FedEx, UPS, USPS)
  tracking_number: string | null;  // Carrier tracking number
  ship_date: string | null;  // Date asset was shipped (ISO format)
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

  // Helper to generate UII (Unique Item Identifier)
  const generateUII = (assetId: number, partno: string): string => {
    return `W91WSL${assetId.toString().padStart(6, '0')}${partno.slice(0, 10)}`;
  };

  return [
    // CRIIS program assets (pgm_id: 1)
    { asset_id: 1, serno: 'CRIIS-001', partno: 'PN-SENSOR-A', part_name: 'Sensor Unit A', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(15), next_pmi_date: addDays(45), eti_hours: 1250, remarks: null, uii: generateUII(1, 'PN-SENSOR-A'), mfg_date: '2020-03-15', acceptance_date: '2020-06-01', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-1', cust_loc_name: 'Maintenance Bay 1', nha_asset_id: 4, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 2, serno: 'CRIIS-002', partno: 'PN-SENSOR-A', part_name: 'Sensor Unit A', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(30), next_pmi_date: addDays(30), eti_hours: 980, remarks: null, uii: generateUII(2, 'PN-SENSOR-A'), mfg_date: '2020-05-22', acceptance_date: '2020-08-10', admin_loc: 'FIELD-B', admin_loc_name: 'Field Site Bravo', cust_loc: 'OPS-CENTER', cust_loc_name: 'Operations Center', nha_asset_id: 4, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 3, serno: 'CRIIS-003', partno: 'PN-SENSOR-B', part_name: 'Sensor Unit B', pgm_id: 1, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(5), next_pmi_date: addDays(85), eti_hours: 2100, remarks: 'Awaiting software update', uii: generateUII(3, 'PN-SENSOR-B'), mfg_date: '2019-11-08', acceptance_date: '2020-01-15', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-2', cust_loc_name: 'Maintenance Bay 2', nha_asset_id: 7, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 4, serno: 'CRIIS-004', partno: 'PN-CAMERA-X', part_name: 'Camera System X', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Charlie', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(60), next_pmi_date: addDays(120), eti_hours: 450, remarks: null, uii: generateUII(4, 'PN-CAMERA-X'), mfg_date: '2021-07-12', acceptance_date: '2021-10-01', admin_loc: 'FIELD-C', admin_loc_name: 'Field Site Charlie', cust_loc: 'FLIGHT-LINE', cust_loc_name: 'Flight Line', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 5, serno: 'CRIIS-005', partno: 'PN-CAMERA-X', part_name: 'Camera System X', pgm_id: 1, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: true, last_maint_date: subtractDays(5), next_pmi_date: null, eti_hours: 3200, remarks: 'Intermittent power failure - MX-2024-001', uii: generateUII(5, 'PN-CAMERA-X'), mfg_date: '2019-02-28', acceptance_date: '2019-05-15', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-1', cust_loc_name: 'Maintenance Bay 1', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 6, serno: 'CRIIS-006', partno: 'PN-RADAR-01', part_name: 'Radar Unit 01', pgm_id: 1, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(10), next_pmi_date: null, eti_hours: 1800, remarks: 'Awaiting power supply - MX-2024-002', uii: generateUII(6, 'PN-RADAR-01'), mfg_date: '2020-09-05', acceptance_date: '2020-12-01', admin_loc: 'FIELD-B', admin_loc_name: 'Field Site Bravo', cust_loc: 'STORAGE-A', cust_loc_name: 'Storage Area A', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 7, serno: 'CRIIS-007', partno: 'PN-RADAR-01', part_name: 'Radar Unit 01', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(45), next_pmi_date: addDays(15), eti_hours: 2500, remarks: null, uii: generateUII(7, 'PN-RADAR-01'), mfg_date: '2019-06-20', acceptance_date: '2019-09-10', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-3', cust_loc_name: 'Maintenance Bay 3', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 8, serno: 'CRIIS-008', partno: 'PN-COMM-SYS', part_name: 'Communication System', pgm_id: 1, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Field Site Charlie', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(1), next_pmi_date: addDays(60), eti_hours: 890, remarks: 'TCTO-2024-15 pending', uii: generateUII(8, 'PN-COMM-SYS'), mfg_date: '2021-01-18', acceptance_date: '2021-04-05', admin_loc: 'FIELD-C', admin_loc_name: 'Field Site Charlie', cust_loc: 'COMM-CENTER', cust_loc_name: 'Communications Center', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 9, serno: 'CRIIS-009', partno: 'PN-COMM-SYS', part_name: 'Communication System', pgm_id: 1, status_cd: 'CNDM', status_name: 'Cannot Determine Mission', active: true, location: 'In Transit', loc_type: 'depot', in_transit: true, bad_actor: false, last_maint_date: subtractDays(90), next_pmi_date: null, eti_hours: null, remarks: 'En route from vendor repair', uii: generateUII(9, 'PN-COMM-SYS'), mfg_date: '2018-11-30', acceptance_date: '2019-02-20', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'IN-TRANSIT', cust_loc_name: 'In Transit', nha_asset_id: null, carrier: 'FedEx', tracking_number: '789456123012', ship_date: subtractDays(3) },
    { asset_id: 10, serno: 'CRIIS-010', partno: 'PN-NAV-UNIT', part_name: 'Navigation Unit', pgm_id: 1, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Bravo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(20), next_pmi_date: addDays(70), eti_hours: 1100, remarks: null, uii: generateUII(10, 'PN-NAV-UNIT'), mfg_date: '2020-08-14', acceptance_date: '2020-11-01', admin_loc: 'FIELD-B', admin_loc_name: 'Field Site Bravo', cust_loc: 'OPS-CENTER', cust_loc_name: 'Operations Center', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },

    // ACTS program assets (pgm_id: 2)
    // Targeting System A (ACTS-001) is a parent assembly (NHA) with child SRAs (Laser Designator and Optical Sight Unit)
    { asset_id: 11, serno: 'ACTS-001', partno: 'PN-TARGET-A', part_name: 'Targeting System A', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(18), next_pmi_date: addDays(90), eti_hours: 750, remarks: null, uii: generateUII(11, 'PN-TARGET-A'), mfg_date: '2021-02-10', acceptance_date: '2021-05-20', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-1', cust_loc_name: 'Maintenance Bay 1', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 12, serno: 'ACTS-002', partno: 'PN-TARGET-A', part_name: 'Targeting System A', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(25), next_pmi_date: addDays(65), eti_hours: 920, remarks: null, uii: generateUII(12, 'PN-TARGET-A'), mfg_date: '2021-04-05', acceptance_date: '2021-07-15', admin_loc: 'FIELD-D', admin_loc_name: 'Field Site Delta', cust_loc: 'RANGE-A', cust_loc_name: 'Range Area A', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 13, serno: 'ACTS-003', partno: 'PN-TARGET-B', part_name: 'Targeting System B', pgm_id: 2, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(3), next_pmi_date: null, eti_hours: 2800, remarks: 'Optical alignment issue - MX-2024-005', uii: generateUII(13, 'PN-TARGET-B'), mfg_date: '2019-08-22', acceptance_date: '2019-11-10', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-2', cust_loc_name: 'Maintenance Bay 2', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    // Laser Designator is a child SRA of Targeting System A (ACTS-001)
    { asset_id: 14, serno: 'ACTS-004', partno: 'PN-LASER-SYS', part_name: 'Laser Designator', pgm_id: 2, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(12), next_pmi_date: addDays(28), eti_hours: 1500, remarks: 'Range limited to 5km', uii: generateUII(14, 'PN-LASER-SYS'), mfg_date: '2020-06-18', acceptance_date: '2020-09-25', admin_loc: 'FIELD-D', admin_loc_name: 'Field Site Delta', cust_loc: 'RANGE-B', cust_loc_name: 'Range Area B', nha_asset_id: 11, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 15, serno: 'ACTS-005', partno: 'PN-LASER-SYS', part_name: 'Laser Designator', pgm_id: 2, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Field Site Delta', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(7), next_pmi_date: null, eti_hours: 3100, remarks: 'Awaiting laser diode - MX-2024-006', uii: generateUII(15, 'PN-LASER-SYS'), mfg_date: '2019-03-12', acceptance_date: '2019-06-01', admin_loc: 'FIELD-D', admin_loc_name: 'Field Site Delta', cust_loc: 'STORAGE-B', cust_loc_name: 'Storage Area B', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    // Optical Sight Unit is a child SRA of Targeting System A (ACTS-001)
    { asset_id: 16, serno: 'ACTS-006', partno: 'PN-OPTICS-01', part_name: 'Optical Sight Unit', pgm_id: 2, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Alpha', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(40), next_pmi_date: addDays(50), eti_hours: 680, remarks: null, uii: generateUII(16, 'PN-OPTICS-01'), mfg_date: '2021-09-08', acceptance_date: '2021-12-15', admin_loc: 'DEPOT-A', admin_loc_name: 'Depot Alpha', cust_loc: 'MAINT-BAY-3', cust_loc_name: 'Maintenance Bay 3', nha_asset_id: 11, carrier: null, tracking_number: null, ship_date: null },

    // ARDS program assets (pgm_id: 3)
    // Data Processor (ARDS-001) is a parent assembly with Reconnaissance Camera and Data Link System as children
    { asset_id: 17, serno: 'ARDS-001', partno: 'PN-DATA-SYS', part_name: 'Data Processor', pgm_id: 3, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(22), next_pmi_date: addDays(68), eti_hours: 1400, remarks: null, uii: generateUII(17, 'PN-DATA-SYS'), mfg_date: '2020-04-25', acceptance_date: '2020-07-30', admin_loc: 'DEPOT-B', admin_loc_name: 'Depot Beta', cust_loc: 'SERVER-ROOM', cust_loc_name: 'Server Room', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 18, serno: 'ARDS-002', partno: 'PN-DATA-SYS', part_name: 'Data Processor', pgm_id: 3, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Field Site Echo', loc_type: 'field', in_transit: false, bad_actor: false, last_maint_date: subtractDays(35), next_pmi_date: addDays(55), eti_hours: 1650, remarks: null, uii: generateUII(18, 'PN-DATA-SYS'), mfg_date: '2020-06-10', acceptance_date: '2020-09-15', admin_loc: 'FIELD-E', admin_loc_name: 'Field Site Echo', cust_loc: 'DATA-CENTER', cust_loc_name: 'Data Center', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    // Reconnaissance Camera is a child SRA of Data Processor (ARDS-001)
    { asset_id: 19, serno: 'ARDS-003', partno: 'PN-RECON-CAM', part_name: 'Reconnaissance Camera', pgm_id: 3, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(8), next_pmi_date: addDays(22), eti_hours: 2200, remarks: 'IR channel degraded', uii: generateUII(19, 'PN-RECON-CAM'), mfg_date: '2019-10-14', acceptance_date: '2020-01-20', admin_loc: 'DEPOT-B', admin_loc_name: 'Depot Beta', cust_loc: 'MAINT-BAY-1', cust_loc_name: 'Maintenance Bay 1', nha_asset_id: 17, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 20, serno: 'ARDS-004', partno: 'PN-RECON-CAM', part_name: 'Reconnaissance Camera', pgm_id: 3, status_cd: 'NMCM', status_name: 'Not Mission Capable Maintenance', active: true, location: 'Depot Beta', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(1), next_pmi_date: null, eti_hours: 2900, remarks: 'Lens recalibration - MX-2024-007', uii: generateUII(20, 'PN-RECON-CAM'), mfg_date: '2019-05-08', acceptance_date: '2019-08-15', admin_loc: 'DEPOT-B', admin_loc_name: 'Depot Beta', cust_loc: 'MAINT-BAY-2', cust_loc_name: 'Maintenance Bay 2', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    // Data Link System is a child SRA of Data Processor (ARDS-001)
    { asset_id: 21, serno: 'ARDS-005', partno: 'PN-LINK-SYS', part_name: 'Data Link System', pgm_id: 3, status_cd: 'CNDM', status_name: 'Cannot Determine Mission', active: true, location: 'In Transit', loc_type: 'depot', in_transit: true, bad_actor: false, last_maint_date: subtractDays(100), next_pmi_date: null, eti_hours: null, remarks: 'Returning from depot repair', uii: generateUII(21, 'PN-LINK-SYS'), mfg_date: '2018-08-20', acceptance_date: '2018-11-30', admin_loc: 'DEPOT-B', admin_loc_name: 'Depot Beta', cust_loc: 'IN-TRANSIT', cust_loc_name: 'In Transit', nha_asset_id: 17, carrier: 'UPS', tracking_number: '1Z999AA10123456784', ship_date: subtractDays(5) },

    // Program 236 assets (pgm_id: 4)
    // Special System Alpha (236-001) is a parent assembly with Special System Beta and Gamma as children
    { asset_id: 22, serno: '236-001', partno: 'PN-SPEC-001', part_name: 'Special System Alpha', pgm_id: 4, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(14), next_pmi_date: addDays(76), eti_hours: 560, remarks: null, uii: generateUII(22, 'PN-SPEC-001'), mfg_date: '2022-01-12', acceptance_date: '2022-04-01', admin_loc: 'SECURE-FAC', admin_loc_name: 'Secure Facility', cust_loc: 'VAULT-A', cust_loc_name: 'Vault A', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    { asset_id: 23, serno: '236-002', partno: 'PN-SPEC-001', part_name: 'Special System Alpha', pgm_id: 4, status_cd: 'NMCS', status_name: 'Not Mission Capable Supply', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(4), next_pmi_date: null, eti_hours: 1200, remarks: 'Awaiting classified component - MX-2024-010', uii: generateUII(23, 'PN-SPEC-001'), mfg_date: '2021-11-05', acceptance_date: '2022-02-15', admin_loc: 'SECURE-FAC', admin_loc_name: 'Secure Facility', cust_loc: 'VAULT-B', cust_loc_name: 'Vault B', nha_asset_id: null, carrier: null, tracking_number: null, ship_date: null },
    // Special System Beta is a child SRA of Special System Alpha (236-001)
    { asset_id: 24, serno: '236-003', partno: 'PN-SPEC-002', part_name: 'Special System Beta', pgm_id: 4, status_cd: 'PMC', status_name: 'Partial Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(28), next_pmi_date: addDays(32), eti_hours: 890, remarks: 'Mode 3 limited', uii: generateUII(24, 'PN-SPEC-002'), mfg_date: '2021-06-22', acceptance_date: '2021-09-30', admin_loc: 'SECURE-FAC', admin_loc_name: 'Secure Facility', cust_loc: 'VAULT-A', cust_loc_name: 'Vault A', nha_asset_id: 22, carrier: null, tracking_number: null, ship_date: null },
    // Special System Gamma is a child SRA of Special System Alpha (236-001)
    { asset_id: 25, serno: '236-004', partno: 'PN-SPEC-003', part_name: 'Special System Gamma', pgm_id: 4, status_cd: 'FMC', status_name: 'Full Mission Capable', active: true, location: 'Secure Facility', loc_type: 'depot', in_transit: false, bad_actor: false, last_maint_date: subtractDays(50), next_pmi_date: addDays(40), eti_hours: 340, remarks: null, uii: generateUII(25, 'PN-SPEC-003'), mfg_date: '2022-03-18', acceptance_date: '2022-06-25', admin_loc: 'SECURE-FAC', admin_loc_name: 'Secure Facility', cust_loc: 'VAULT-C', cust_loc_name: 'Vault C', nha_asset_id: 22, carrier: null, tracking_number: null, ship_date: null },
  ];
}

// Mutable array of detailed assets - initialized once, persists modifications
const detailedAssets: AssetDetails[] = initializeDetailedAssets();

// Create new PMI record (moved here so detailedAssets is available)
app.post('/api/pmi', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check permissions - only depot_manager and admin can create PMI
  if (!['DEPOT_MANAGER', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Only depot managers and admins can create PMI records' });
  }

  const { asset_id, pmi_type, next_due_date, wuc_cd, interval_days } = req.body;

  // Validate required fields
  if (!asset_id) {
    return res.status(400).json({ error: 'Asset is required' });
  }
  if (!pmi_type || pmi_type.trim() === '') {
    return res.status(400).json({ error: 'PMI type is required' });
  }
  if (!next_due_date) {
    return res.status(400).json({ error: 'Due date is required' });
  }

  // Get asset details from detailed assets array
  const asset = detailedAssets.find(a => a.asset_id === parseInt(asset_id, 10));
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Calculate days until due
  const daysUntilDue = calculateDaysUntilDue(next_due_date);

  // Parse interval_days - default to 30 if not provided
  const parsedIntervalDays = interval_days ? parseInt(interval_days, 10) : 30;
  // Validate interval is one of the standard values
  const validIntervals = [30, 60, 90, 180, 365];
  const finalIntervalDays = validIntervals.includes(parsedIntervalDays) ? parsedIntervalDays : 30;

  // Create new PMI record
  const newPMI: PMIRecord = {
    pmi_id: nextCustomPMIId++,
    asset_id: asset.asset_id,
    asset_sn: asset.serno,
    asset_name: asset.part_name || asset.partno || 'Unknown',
    pmi_type: pmi_type.trim(),
    wuc_cd: wuc_cd?.trim() || '',
    next_due_date: next_due_date,
    days_until_due: daysUntilDue,
    completed_date: null,
    pgm_id: asset.pgm_id,
    status: getPMIStatus(daysUntilDue),
    interval_days: finalIntervalDays,
  };

  customPMIRecords.push(newPMI);

  console.log(`[PMI] Created PMI #${newPMI.pmi_id} by ${user.username} - Type: ${newPMI.pmi_type}, Asset: ${newPMI.asset_sn}`);

  res.status(201).json({
    message: 'PMI record created successfully',
    pmi: newPMI,
  });
});

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

  // Get detailed assets from mutable array
  const allAssets = detailedAssets;

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

  // Apply sorting
  const sortBy = (req.query.sort_by as string) || 'serno';
  const sortOrder = (req.query.sort_order as string) || 'asc';

  // Valid sort columns
  const validSortColumns = ['serno', 'partno', 'part_name', 'status_cd', 'location', 'eti_hours', 'next_pmi_date'];
  if (validSortColumns.includes(sortBy)) {
    filteredAssets.sort((a: AssetDetails, b: AssetDetails) => {
      let aVal: string | number | null = null;
      let bVal: string | number | null = null;

      switch (sortBy) {
        case 'serno':
          aVal = a.serno.toLowerCase();
          bVal = b.serno.toLowerCase();
          break;
        case 'partno':
          aVal = a.partno.toLowerCase();
          bVal = b.partno.toLowerCase();
          break;
        case 'part_name':
          aVal = a.part_name.toLowerCase();
          bVal = b.part_name.toLowerCase();
          break;
        case 'status_cd':
          aVal = a.status_cd;
          bVal = b.status_cd;
          break;
        case 'location':
          aVal = a.location.toLowerCase();
          bVal = b.location.toLowerCase();
          break;
        case 'eti_hours':
          aVal = a.eti_hours ?? 0;
          bVal = b.eti_hours ?? 0;
          break;
        case 'next_pmi_date':
          aVal = a.next_pmi_date ? new Date(a.next_pmi_date).getTime() : 0;
          bVal = b.next_pmi_date ? new Date(b.next_pmi_date).getTime() : 0;
          break;
      }

      if (aVal === null || bVal === null) return 0;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });
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

// GET /api/assets/available-for-install - Get assets available for installation/cannibalization
app.get('/api/assets/available-for-install', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get assets that are FMC or PMC status (operational) from user's programs
  const availableAssets = mockAssets
    .filter(asset => {
      if (!userProgramIds.includes(asset.pgm_id)) return false;
      if (!asset.active) return false;
      return asset.status_cd === 'FMC' || asset.status_cd === 'PMC';
    })
    .map(asset => ({
      asset_id: asset.asset_id,
      serno: asset.serno,
      partno: asset.partno,
      nomen: asset.name,
      status: asset.status_cd,
      location: asset.cust_loc || null,
    }));

  console.log(`[ASSETS] Available for install - User: ${user.username}, Count: ${availableAssets.length}`);

  res.json({ assets: availableAssets });
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

  // Get the asset from detailedAssets
  const asset = detailedAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get program info for display
  const program = allPrograms.find(p => p.pgm_id === asset.pgm_id);

  res.json({
    asset: {
      ...asset,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    }
  });
});

// GET /api/assets/:id/hierarchy - Get asset NHA/SRA hierarchy (requires authentication)
app.get('/api/assets/:id/hierarchy', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);

  // Get the asset from detailedAssets
  const asset = detailedAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === asset.pgm_id);

  // Get parent asset (NHA - Next Higher Assembly)
  let nha: { asset_id: number; serno: string; partno: string; part_name: string; status_cd: string; status_name: string } | null = null;
  if (asset.nha_asset_id) {
    const parentAsset = detailedAssets.find(a => a.asset_id === asset.nha_asset_id);
    if (parentAsset) {
      nha = {
        asset_id: parentAsset.asset_id,
        serno: parentAsset.serno,
        partno: parentAsset.partno,
        part_name: parentAsset.part_name,
        status_cd: parentAsset.status_cd,
        status_name: parentAsset.status_name,
      };
    }
  }

  // Get child assets (SRA - Shop Replaceable Assemblies)
  const sra = detailedAssets
    .filter(a => a.nha_asset_id === assetId)
    .map(child => ({
      asset_id: child.asset_id,
      serno: child.serno,
      partno: child.partno,
      part_name: child.part_name,
      status_cd: child.status_cd,
      status_name: child.status_name,
    }));

  console.log(`[ASSETS] Hierarchy request by ${user.username} for asset ${assetId}: NHA=${nha?.serno || 'none'}, SRA count=${sra.length}`);

  res.json({
    asset: {
      asset_id: asset.asset_id,
      serno: asset.serno,
      partno: asset.partno,
      part_name: asset.part_name,
      status_cd: asset.status_cd,
      status_name: asset.status_name,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    },
    nha,
    sra,
    has_nha: nha !== null,
    has_sra: sra.length > 0,
  });
});

// GET /api/assets/:id/history - Get asset change history (requires authentication)
app.get('/api/assets/:id/history', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);
  const asset = mockAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get history entries for this asset, sorted by timestamp descending (most recent first)
  const history = assetHistory
    .filter(h => h.asset_id === assetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  console.log(`[ASSETS] History request by ${user.username} for asset ${asset.serno} (ID: ${assetId}) - ${history.length} entries`);

  res.json({
    asset_id: assetId,
    serno: asset.serno,
    history,
    total: history.length,
  });
});

// GET /api/assets/:id/eti-history - Get ETI (Elapsed Time Indicator) history for an asset
app.get('/api/assets/:id/eti-history', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);
  const asset = detailedAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Get ETI history entries for this asset, sorted by timestamp descending (most recent first)
  const history = etiHistory
    .filter(h => h.asset_id === assetId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  console.log(`[ETI] History request by ${user.username} for asset ${asset.serno} (ID: ${assetId}) - ${history.length} entries`);

  res.json({
    asset_id: assetId,
    serno: asset.serno,
    current_eti_hours: asset.eti_hours,
    history,
    total: history.length,
  });
});

// POST /api/assets/:id/eti - Update ETI hours for an asset (requires authentication and depot_manager/admin/field_technician role)
app.post('/api/assets/:id/eti', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check role - ADMIN, DEPOT_MANAGER, and FIELD_TECHNICIAN can update ETI
  if (!['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)) {
    return res.status(403).json({ error: 'You do not have permission to update ETI hours' });
  }

  const assetId = parseInt(req.params.id, 10);
  const asset = detailedAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  const { hours_to_add, new_eti_hours, source, source_ref, notes } = req.body;

  // Validate input - either hours_to_add or new_eti_hours must be provided
  if (hours_to_add === undefined && new_eti_hours === undefined) {
    return res.status(400).json({ error: 'Either hours_to_add or new_eti_hours must be provided' });
  }

  // Validate source
  const validSources: Array<'maintenance' | 'manual' | 'sortie'> = ['maintenance', 'manual', 'sortie'];
  const sourceType = source || 'manual';
  if (!validSources.includes(sourceType)) {
    return res.status(400).json({ error: 'Invalid source. Must be maintenance, manual, or sortie' });
  }

  const oldETI = asset.eti_hours;
  let calculatedHoursAdded: number;
  let calculatedNewETI: number;

  if (new_eti_hours !== undefined) {
    // Direct ETI value set
    calculatedNewETI = parseFloat(new_eti_hours);
    if (isNaN(calculatedNewETI) || calculatedNewETI < 0) {
      return res.status(400).json({ error: 'new_eti_hours must be a non-negative number' });
    }
    calculatedHoursAdded = calculatedNewETI - (oldETI || 0);
  } else {
    // Add hours to existing
    calculatedHoursAdded = parseFloat(hours_to_add);
    if (isNaN(calculatedHoursAdded)) {
      return res.status(400).json({ error: 'hours_to_add must be a valid number' });
    }
    calculatedNewETI = (oldETI || 0) + calculatedHoursAdded;
    if (calculatedNewETI < 0) {
      return res.status(400).json({ error: 'ETI hours cannot be negative' });
    }
  }

  // Update the asset's ETI
  asset.eti_hours = calculatedNewETI;

  // Also update the mockAssets entry if exists
  const mockAsset = mockAssets.find(a => a.asset_id === assetId);
  // Note: mockAssets doesn't have eti_hours, but detailedAssets does

  // Add ETI history entry
  const historyEntry = addETIHistory(
    assetId,
    user,
    oldETI,
    calculatedNewETI,
    calculatedHoursAdded,
    sourceType,
    null,  // source_id - could be linked to maintenance event
    source_ref || null,
    notes || null
  );

  // Add to asset history as well
  const historyChanges: AssetHistoryChange[] = [{
    field: 'eti_hours',
    field_label: 'ETI Hours',
    old_value: oldETI?.toString() || '0',
    new_value: calculatedNewETI.toString()
  }];

  addAssetHistory(
    assetId,
    user,
    'update',
    historyChanges,
    `Updated ETI hours: ${oldETI || 0} → ${calculatedNewETI} (${calculatedHoursAdded >= 0 ? '+' : ''}${calculatedHoursAdded} hours via ${sourceType})`
  );

  console.log(`[ETI] Updated by ${user.username} for asset ${asset.serno}: ${oldETI || 0} → ${calculatedNewETI} (${calculatedHoursAdded >= 0 ? '+' : ''}${calculatedHoursAdded})`);

  res.json({
    message: 'ETI hours updated successfully',
    asset_id: assetId,
    serno: asset.serno,
    old_eti_hours: oldETI,
    new_eti_hours: calculatedNewETI,
    hours_added: calculatedHoursAdded,
    history_entry: historyEntry,
  });
});

// GET /api/assets/:id/events - Get maintenance events linked to an asset
app.get('/api/assets/:id/events', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const assetId = parseInt(req.params.id, 10);
  const asset = mockAssets.find(a => a.asset_id === assetId);

  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this asset' });
  }

  // Find all maintenance events linked to this asset
  const assetEvents = maintenanceEvents
    .filter(e => e.asset_id === assetId)
    .sort((a, b) => new Date(b.start_job).getTime() - new Date(a.start_job).getTime());

  // Calculate summary statistics
  const summary = {
    total: assetEvents.length,
    open: assetEvents.filter(e => e.status === 'open').length,
    closed: assetEvents.filter(e => e.status === 'closed').length,
    by_type: {
      standard: assetEvents.filter(e => e.event_type === 'Standard').length,
      pmi: assetEvents.filter(e => e.event_type === 'PMI').length,
      tcto: assetEvents.filter(e => e.event_type === 'TCTO').length,
      bitpc: assetEvents.filter(e => e.event_type === 'BIT/PC').length,
    },
  };

  console.log(`[ASSETS] Events request by ${user.username} for asset ${asset.serno} (ID: ${assetId}) - ${assetEvents.length} events`);

  res.json({
    asset_id: assetId,
    serno: asset.serno,
    events: assetEvents,
    summary,
    total: assetEvents.length,
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

  const { partno, serno, name, status_cd, admin_loc, cust_loc, notes, active, bad_actor, in_transit, carrier, tracking_number, ship_date } = req.body;

  // Track changes for audit log
  const changes: string[] = [];
  const historyChanges: AssetHistoryChange[] = [];

  // Validate and apply changes
  if (partno !== undefined && partno !== asset.partno) {
    if (!partno) {
      return res.status(400).json({ error: 'Part number cannot be empty' });
    }
    changes.push(`Part Number: ${asset.partno} → ${partno}`);
    historyChanges.push({ field: 'partno', field_label: 'Part Number', old_value: asset.partno, new_value: partno });
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
    historyChanges.push({ field: 'serno', field_label: 'Serial Number', old_value: asset.serno, new_value: serno });
    asset.serno = serno;
  }

  if (name !== undefined && name !== asset.name) {
    changes.push(`Name: ${asset.name} → ${name}`);
    historyChanges.push({ field: 'name', field_label: 'Name', old_value: asset.name, new_value: name || `${asset.partno} - ${asset.serno}` });
    asset.name = name || `${asset.partno} - ${asset.serno}`;
  }

  if (status_cd !== undefined && status_cd !== asset.status_cd) {
    const validStatuses = assetStatusCodes.map(s => s.status_cd);
    if (!validStatuses.includes(status_cd)) {
      return res.status(400).json({ error: 'Invalid status code' });
    }

    // Validate status transition using business rules
    const transitionResult = isValidStatusTransition(asset.status_cd, status_cd);
    if (!transitionResult.valid) {
      return res.status(400).json({ error: transitionResult.message });
    }

    const oldStatus = assetStatusCodes.find(s => s.status_cd === asset.status_cd);
    const newStatus = assetStatusCodes.find(s => s.status_cd === status_cd);
    changes.push(`Status: ${oldStatus?.status_name || asset.status_cd} → ${newStatus?.status_name || status_cd}`);
    historyChanges.push({ field: 'status_cd', field_label: 'Status', old_value: oldStatus?.status_name || asset.status_cd, new_value: newStatus?.status_name || status_cd });
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
    historyChanges.push({ field: 'admin_loc', field_label: 'Admin Location', old_value: oldLoc?.loc_name || asset.admin_loc, new_value: newLoc?.loc_name || admin_loc });
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
    historyChanges.push({ field: 'cust_loc', field_label: 'Custodial Location', old_value: oldLoc?.loc_name || asset.cust_loc, new_value: newLoc?.loc_name || cust_loc });
    asset.cust_loc = cust_loc;
  }

  if (notes !== undefined && notes !== asset.notes) {
    changes.push(`Notes: "${asset.notes || '(empty)'}" → "${notes || '(empty)'}"`);
    historyChanges.push({ field: 'notes', field_label: 'Notes', old_value: asset.notes || '(empty)', new_value: notes || '(empty)' });
    asset.notes = notes;
  }

  if (active !== undefined && active !== asset.active) {
    changes.push(`Active: ${asset.active ? 'Yes' : 'No'} → ${active ? 'Yes' : 'No'}`);
    historyChanges.push({ field: 'active', field_label: 'Active', old_value: asset.active ? 'Yes' : 'No', new_value: active ? 'Yes' : 'No' });
    asset.active = active;
  }

  // Also find and update the detailed asset entry for bad_actor and other fields
  const detailedAsset = detailedAssets.find(a => a.asset_id === assetId);

  if (bad_actor !== undefined && detailedAsset && bad_actor !== detailedAsset.bad_actor) {
    changes.push(`Bad Actor: ${detailedAsset.bad_actor ? 'Yes' : 'No'} → ${bad_actor ? 'Yes' : 'No'}`);
    historyChanges.push({ field: 'bad_actor', field_label: 'Bad Actor', old_value: detailedAsset.bad_actor ? 'Yes' : 'No', new_value: bad_actor ? 'Yes' : 'No' });
    detailedAsset.bad_actor = bad_actor;
  }

  // Handle in-transit fields (only on detailedAssets)
  if (in_transit !== undefined && detailedAsset && in_transit !== detailedAsset.in_transit) {
    changes.push(`In Transit: ${detailedAsset.in_transit ? 'Yes' : 'No'} → ${in_transit ? 'Yes' : 'No'}`);
    historyChanges.push({ field: 'in_transit', field_label: 'In Transit', old_value: detailedAsset.in_transit ? 'Yes' : 'No', new_value: in_transit ? 'Yes' : 'No' });
    detailedAsset.in_transit = in_transit;

    // If setting in_transit to false, clear shipping info
    if (!in_transit) {
      if (detailedAsset.carrier || detailedAsset.tracking_number || detailedAsset.ship_date) {
        changes.push('Cleared shipping information');
        historyChanges.push({ field: 'carrier', field_label: 'Carrier', old_value: detailedAsset.carrier, new_value: null });
        historyChanges.push({ field: 'tracking_number', field_label: 'Tracking Number', old_value: detailedAsset.tracking_number, new_value: null });
        historyChanges.push({ field: 'ship_date', field_label: 'Ship Date', old_value: detailedAsset.ship_date, new_value: null });
      }
      detailedAsset.carrier = null;
      detailedAsset.tracking_number = null;
      detailedAsset.ship_date = null;
    }
  }

  if (carrier !== undefined && detailedAsset && carrier !== detailedAsset.carrier) {
    changes.push(`Carrier: ${detailedAsset.carrier || '(none)'} → ${carrier || '(none)'}`);
    historyChanges.push({ field: 'carrier', field_label: 'Carrier', old_value: detailedAsset.carrier || '(none)', new_value: carrier || '(none)' });
    detailedAsset.carrier = carrier || null;
  }

  if (tracking_number !== undefined && detailedAsset && tracking_number !== detailedAsset.tracking_number) {
    changes.push(`Tracking Number: ${detailedAsset.tracking_number || '(none)'} → ${tracking_number || '(none)'}`);
    historyChanges.push({ field: 'tracking_number', field_label: 'Tracking Number', old_value: detailedAsset.tracking_number || '(none)', new_value: tracking_number || '(none)' });
    detailedAsset.tracking_number = tracking_number || null;
  }

  if (ship_date !== undefined && detailedAsset && ship_date !== detailedAsset.ship_date) {
    changes.push(`Ship Date: ${detailedAsset.ship_date || '(none)'} → ${ship_date || '(none)'}`);
    historyChanges.push({ field: 'ship_date', field_label: 'Ship Date', old_value: detailedAsset.ship_date || '(none)', new_value: ship_date || '(none)' });
    detailedAsset.ship_date = ship_date || null;
  }

  // Sync other changes to detailedAssets if present
  if (detailedAsset) {
    if (serno !== undefined) detailedAsset.serno = asset.serno;
    if (partno !== undefined) detailedAsset.partno = asset.partno;
    if (name !== undefined) detailedAsset.part_name = asset.name;
    if (status_cd !== undefined) {
      detailedAsset.status_cd = asset.status_cd;
      const statusInfo = assetStatusCodes.find(s => s.status_cd === status_cd);
      detailedAsset.status_name = statusInfo?.status_name || status_cd;
    }
    if (admin_loc !== undefined) {
      detailedAsset.admin_loc = asset.admin_loc;
      const locInfo = adminLocations.find(l => l.loc_cd === admin_loc);
      detailedAsset.admin_loc_name = locInfo?.loc_name || admin_loc;
    }
    if (cust_loc !== undefined) {
      detailedAsset.cust_loc = asset.cust_loc;
      const locInfo = custodialLocations.find(l => l.loc_cd === cust_loc);
      detailedAsset.cust_loc_name = locInfo?.loc_name || cust_loc;
    }
    if (notes !== undefined) detailedAsset.remarks = notes;
    if (active !== undefined) detailedAsset.active = active;
  }

  if (changes.length === 0) {
    return res.status(400).json({ error: 'No changes provided' });
  }

  // Add to asset history
  addAssetHistory(
    assetId,
    user,
    'update',
    historyChanges,
    `Updated asset ${asset.serno}: ${changes.join('; ')}`
  );

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
      bad_actor: detailedAsset?.bad_actor || false,
      in_transit: detailedAsset?.in_transit || false,
      carrier: detailedAsset?.carrier || null,
      tracking_number: detailedAsset?.tracking_number || null,
      ship_date: detailedAsset?.ship_date || null,
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

  // Check for duplicate serial number + part number combination (within same program)
  const existingAsset = mockAssets.find(a =>
    a.serno.toLowerCase() === serno.toLowerCase() &&
    a.partno.toLowerCase() === partno.toLowerCase() &&
    a.pgm_id === pgm_id
  );
  if (existingAsset) {
    return res.status(400).json({ error: `An asset with serial number '${serno}' and part number '${partno}' already exists in this program` });
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

  // Also add to detailedAssets for GET endpoint to show the new asset
  const newDetailedAsset: AssetDetails = {
    asset_id: newAssetId,
    serno,
    partno,
    part_name: name || `${partno} - ${serno}`,
    pgm_id,
    status_cd,
    status_name: statusInfo?.status_name || status_cd,
    active: true,
    location: adminLocInfo?.loc_name || admin_loc,
    loc_type: adminLocInfo?.loc_type as 'depot' | 'field' || 'depot',
    in_transit: false,
    bad_actor: false,
    last_maint_date: null,
    next_pmi_date: null,
    eti_hours: 0,
    remarks: notes || null,
  };
  detailedAssets.push(newDetailedAsset);

  // Add creation to asset history
  const createChanges: AssetHistoryChange[] = [
    { field: 'serno', field_label: 'Serial Number', old_value: null, new_value: serno },
    { field: 'partno', field_label: 'Part Number', old_value: null, new_value: partno },
    { field: 'name', field_label: 'Name', old_value: null, new_value: name || `${partno} - ${serno}` },
    { field: 'status_cd', field_label: 'Status', old_value: null, new_value: statusInfo?.status_name || status_cd },
    { field: 'admin_loc', field_label: 'Admin Location', old_value: null, new_value: adminLocInfo?.loc_name || admin_loc },
    { field: 'cust_loc', field_label: 'Custodial Location', old_value: null, new_value: custLocInfo?.loc_name || cust_loc },
  ];
  if (notes) {
    createChanges.push({ field: 'notes', field_label: 'Notes', old_value: null, new_value: notes });
  }

  addAssetHistory(
    newAssetId,
    user,
    'create',
    createChanges,
    `Asset ${serno} created`
  );

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
  const assetIndex = detailedAssets.findIndex(a => a.asset_id === assetId);

  if (assetIndex === -1) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  const asset = detailedAssets[assetIndex];

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
    name: asset.part_name,
    pgm_id: asset.pgm_id,
  };

  // Remove the asset from the array
  detailedAssets.splice(assetIndex, 1);

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
    transitionRules: statusTransitionRules,
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

// =====================================
// CONFIGURATIONS (cfg_set) ENDPOINTS
// =====================================

// Configuration set interface
interface ConfigurationSet {
  cfg_set_id: number;
  cfg_name: string;
  cfg_type: string;
  pgm_id: number;
  partno_id: number | null;
  partno: string | null;
  part_name: string | null;
  description: string | null;
  active: boolean;
  ins_by: string;
  ins_date: string;
  chg_by: string | null;
  chg_date: string | null;
  // Computed fields
  bom_item_count: number;
  asset_count: number;
}

// BOM (Bill of Materials) item interface
interface BOMItem {
  list_id: number;
  cfg_set_id: number;
  partno_p: string;  // Parent part number (configuration's base part)
  partno_c: string;  // Child part number (this item's part number)
  part_name_c: string;  // Child part name
  sort_order: number;
  qpa: number;  // Quantity per assembly
  active: boolean;
  nha_partno_c: string | null;  // NHA (Next Higher Assembly) - parent part within BOM hierarchy
  is_sra: boolean;  // Is this a Sub-Replaceable Assembly (has an NHA parent)?
}

// Initialize mock configuration data
function initializeConfigurations(): ConfigurationSet[] {
  const today = new Date();
  const subtractDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  return [
    // CRIIS program configurations (pgm_id: 1)
    {
      cfg_set_id: 1,
      cfg_name: 'Camera System X Configuration',
      cfg_type: 'ASSEMBLY',
      pgm_id: 1,
      partno_id: 4,
      partno: 'PN-CAMERA-X',
      part_name: 'Camera System X',
      description: 'Standard camera system configuration including sensor units and mounting hardware',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(365),
      chg_by: 'depot_mgr',
      chg_date: subtractDays(30),
      bom_item_count: 3,
      asset_count: 2,
    },
    {
      cfg_set_id: 2,
      cfg_name: 'Radar Unit Configuration',
      cfg_type: 'ASSEMBLY',
      pgm_id: 1,
      partno_id: 6,
      partno: 'PN-RADAR-01',
      part_name: 'Radar Unit 01',
      description: 'Complete radar unit configuration with power supply and antenna assembly',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(400),
      chg_by: null,
      chg_date: null,
      bom_item_count: 4,
      asset_count: 2,
    },
    {
      cfg_set_id: 3,
      cfg_name: 'Communication System Config',
      cfg_type: 'SYSTEM',
      pgm_id: 1,
      partno_id: 8,
      partno: 'PN-COMM-SYS',
      part_name: 'Communication System',
      description: 'Field communication system configuration with encryption modules',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(300),
      chg_by: 'depot_mgr',
      chg_date: subtractDays(15),
      bom_item_count: 5,
      asset_count: 2,
    },
    {
      cfg_set_id: 4,
      cfg_name: 'Navigation Unit Standard',
      cfg_type: 'COMPONENT',
      pgm_id: 1,
      partno_id: 10,
      partno: 'PN-NAV-UNIT',
      part_name: 'Navigation Unit',
      description: 'GPS-enabled navigation unit with inertial backup',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(250),
      chg_by: null,
      chg_date: null,
      bom_item_count: 2,
      asset_count: 1,
    },
    // ACTS program configurations (pgm_id: 2)
    {
      cfg_set_id: 5,
      cfg_name: 'Targeting System A Config',
      cfg_type: 'ASSEMBLY',
      pgm_id: 2,
      partno_id: 11,
      partno: 'PN-TARGET-A',
      part_name: 'Targeting System A',
      description: 'Primary targeting system with laser designator and optical sight',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(350),
      chg_by: 'depot_mgr',
      chg_date: subtractDays(45),
      bom_item_count: 4,
      asset_count: 2,
    },
    {
      cfg_set_id: 6,
      cfg_name: 'Targeting System B Config',
      cfg_type: 'ASSEMBLY',
      pgm_id: 2,
      partno_id: 13,
      partno: 'PN-TARGET-B',
      part_name: 'Targeting System B',
      description: 'Advanced targeting system with thermal imaging',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(280),
      chg_by: null,
      chg_date: null,
      bom_item_count: 3,
      asset_count: 1,
    },
    {
      cfg_set_id: 7,
      cfg_name: 'Laser Designator Config',
      cfg_type: 'COMPONENT',
      pgm_id: 2,
      partno_id: 14,
      partno: 'PN-LASER-SYS',
      part_name: 'Laser Designator',
      description: 'High-power laser designator module configuration',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(200),
      chg_by: null,
      chg_date: null,
      bom_item_count: 2,
      asset_count: 2,
    },
    // ARDS program configurations (pgm_id: 3)
    {
      cfg_set_id: 8,
      cfg_name: 'Data Processor Configuration',
      cfg_type: 'SYSTEM',
      pgm_id: 3,
      partno_id: 17,
      partno: 'PN-DATA-SYS',
      part_name: 'Data Processor',
      description: 'High-performance data processor with reconnaissance camera and data link',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(320),
      chg_by: 'depot_mgr',
      chg_date: subtractDays(60),
      bom_item_count: 5,
      asset_count: 2,
    },
    {
      cfg_set_id: 9,
      cfg_name: 'Reconnaissance Camera Config',
      cfg_type: 'COMPONENT',
      pgm_id: 3,
      partno_id: 19,
      partno: 'PN-RECON-CAM',
      part_name: 'Reconnaissance Camera',
      description: 'Multi-spectrum reconnaissance camera with IR capability',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(180),
      chg_by: null,
      chg_date: null,
      bom_item_count: 3,
      asset_count: 2,
    },
    {
      cfg_set_id: 10,
      cfg_name: 'Data Link System Config',
      cfg_type: 'COMPONENT',
      pgm_id: 3,
      partno_id: 21,
      partno: 'PN-LINK-SYS',
      part_name: 'Data Link System',
      description: 'Encrypted data link for real-time transmission',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(150),
      chg_by: null,
      chg_date: null,
      bom_item_count: 2,
      asset_count: 1,
    },
    // Program 236 configurations (pgm_id: 4)
    {
      cfg_set_id: 11,
      cfg_name: 'Special System Alpha Config',
      cfg_type: 'SYSTEM',
      pgm_id: 4,
      partno_id: 22,
      partno: 'PN-SPEC-001',
      part_name: 'Special System Alpha',
      description: 'Classified system configuration - access restricted',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(400),
      chg_by: 'admin',
      chg_date: subtractDays(90),
      bom_item_count: 4,
      asset_count: 2,
    },
    {
      cfg_set_id: 12,
      cfg_name: 'Special System Beta Config',
      cfg_type: 'COMPONENT',
      pgm_id: 4,
      partno_id: 24,
      partno: 'PN-SPEC-002',
      part_name: 'Special System Beta',
      description: 'Secondary classified system module',
      active: true,
      ins_by: 'admin',
      ins_date: subtractDays(220),
      chg_by: null,
      chg_date: null,
      bom_item_count: 2,
      asset_count: 1,
    },
    // Inactive configuration for testing
    {
      cfg_set_id: 13,
      cfg_name: 'Legacy Sensor Config (Deprecated)',
      cfg_type: 'COMPONENT',
      pgm_id: 1,
      partno_id: null,
      partno: 'PN-SENSOR-OLD',
      part_name: 'Legacy Sensor Unit',
      description: 'Deprecated configuration - do not use for new installations',
      active: false,
      ins_by: 'admin',
      ins_date: subtractDays(800),
      chg_by: 'admin',
      chg_date: subtractDays(500),
      bom_item_count: 0,
      asset_count: 0,
    },
  ];
}

// Mutable array of configurations
const configurations: ConfigurationSet[] = initializeConfigurations();

// Initialize BOM (Bill of Materials) mock data with NHA/SRA hierarchy
function initializeBOMItems(): BOMItem[] {
  return [
    // Config 1: Camera System X Configuration (cfg_set_id: 1, partno: PN-CAMERA-X)
    // NHA hierarchy: PN-SENSOR-A is an NHA (assembly), PN-MOUNT-KIT and PN-CABLE-CAM are SRAs under it
    { list_id: 1, cfg_set_id: 1, partno_p: 'PN-CAMERA-X', partno_c: 'PN-SENSOR-A', part_name_c: 'Sensor Unit Alpha', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 2, cfg_set_id: 1, partno_p: 'PN-CAMERA-X', partno_c: 'PN-MOUNT-KIT', part_name_c: 'Universal Mounting Kit', sort_order: 2, qpa: 2, active: true, nha_partno_c: 'PN-SENSOR-A', is_sra: true },
    { list_id: 3, cfg_set_id: 1, partno_p: 'PN-CAMERA-X', partno_c: 'PN-CABLE-CAM', part_name_c: 'Camera Cable Assembly', sort_order: 3, qpa: 3, active: true, nha_partno_c: 'PN-SENSOR-A', is_sra: true },

    // Config 2: Radar Unit Configuration (cfg_set_id: 2, partno: PN-RADAR-01)
    // NHA hierarchy: PN-ANTENNA-RADAR is NHA with PSU and CONTROL-PCB as SRAs
    { list_id: 4, cfg_set_id: 2, partno_p: 'PN-RADAR-01', partno_c: 'PN-ANTENNA-RADAR', part_name_c: 'Radar Antenna Assembly', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 5, cfg_set_id: 2, partno_p: 'PN-RADAR-01', partno_c: 'PN-PSU-RADAR', part_name_c: 'Radar Power Supply Unit', sort_order: 2, qpa: 1, active: true, nha_partno_c: 'PN-ANTENNA-RADAR', is_sra: true },
    { list_id: 6, cfg_set_id: 2, partno_p: 'PN-RADAR-01', partno_c: 'PN-WAVEGUIDE', part_name_c: 'Waveguide Assembly', sort_order: 3, qpa: 2, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 7, cfg_set_id: 2, partno_p: 'PN-RADAR-01', partno_c: 'PN-CONTROL-PCB', part_name_c: 'Radar Control Board', sort_order: 4, qpa: 1, active: true, nha_partno_c: 'PN-ANTENNA-RADAR', is_sra: true },

    // Config 3: Communication System Config (cfg_set_id: 3, partno: PN-COMM-SYS)
    // NHA hierarchy: PN-RADIO-TX is NHA with ENCRYPT-MOD as SRA
    { list_id: 8, cfg_set_id: 3, partno_p: 'PN-COMM-SYS', partno_c: 'PN-RADIO-TX', part_name_c: 'Radio Transmitter Module', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 9, cfg_set_id: 3, partno_p: 'PN-COMM-SYS', partno_c: 'PN-RADIO-RX', part_name_c: 'Radio Receiver Module', sort_order: 2, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 10, cfg_set_id: 3, partno_p: 'PN-COMM-SYS', partno_c: 'PN-ENCRYPT-MOD', part_name_c: 'Encryption Module', sort_order: 3, qpa: 1, active: true, nha_partno_c: 'PN-RADIO-TX', is_sra: true },
    { list_id: 11, cfg_set_id: 3, partno_p: 'PN-COMM-SYS', partno_c: 'PN-ANTENNA-COMM', part_name_c: 'Communication Antenna', sort_order: 4, qpa: 2, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 12, cfg_set_id: 3, partno_p: 'PN-COMM-SYS', partno_c: 'PN-CABLE-COAX', part_name_c: 'Coaxial Cable Assembly', sort_order: 5, qpa: 4, active: true, nha_partno_c: 'PN-ANTENNA-COMM', is_sra: true },

    // Config 4: Navigation Unit Standard (cfg_set_id: 4, partno: PN-NAV-UNIT)
    { list_id: 13, cfg_set_id: 4, partno_p: 'PN-NAV-UNIT', partno_c: 'PN-GPS-RECV', part_name_c: 'GPS Receiver Module', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 14, cfg_set_id: 4, partno_p: 'PN-NAV-UNIT', partno_c: 'PN-INERTIAL-MOD', part_name_c: 'Inertial Navigation Module', sort_order: 2, qpa: 1, active: true, nha_partno_c: null, is_sra: false },

    // Config 5: Targeting System A Config (cfg_set_id: 5, partno: PN-TARGET-A)
    // NHA hierarchy: PN-LASER-DES and PN-OPTICAL-SIGHT are NHAs with SERVO-MOUNT as SRA under OPTICAL-SIGHT
    { list_id: 15, cfg_set_id: 5, partno_p: 'PN-TARGET-A', partno_c: 'PN-LASER-DES', part_name_c: 'Laser Designator Unit', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 16, cfg_set_id: 5, partno_p: 'PN-TARGET-A', partno_c: 'PN-OPTICAL-SIGHT', part_name_c: 'Optical Sight Assembly', sort_order: 2, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 17, cfg_set_id: 5, partno_p: 'PN-TARGET-A', partno_c: 'PN-SERVO-MOUNT', part_name_c: 'Servo Mount System', sort_order: 3, qpa: 1, active: true, nha_partno_c: 'PN-OPTICAL-SIGHT', is_sra: true },
    { list_id: 18, cfg_set_id: 5, partno_p: 'PN-TARGET-A', partno_c: 'PN-CONTROL-UNIT', part_name_c: 'Targeting Control Unit', sort_order: 4, qpa: 1, active: true, nha_partno_c: null, is_sra: false },

    // Config 6: Targeting System B Config (cfg_set_id: 6, partno: PN-TARGET-B)
    // NHA hierarchy: PN-THERMAL-CAM is NHA with IMAGE-PROC and COOLING-SYS as SRAs
    { list_id: 19, cfg_set_id: 6, partno_p: 'PN-TARGET-B', partno_c: 'PN-THERMAL-CAM', part_name_c: 'Thermal Imaging Camera', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 20, cfg_set_id: 6, partno_p: 'PN-TARGET-B', partno_c: 'PN-IMAGE-PROC', part_name_c: 'Image Processing Unit', sort_order: 2, qpa: 1, active: true, nha_partno_c: 'PN-THERMAL-CAM', is_sra: true },
    { list_id: 21, cfg_set_id: 6, partno_p: 'PN-TARGET-B', partno_c: 'PN-COOLING-SYS', part_name_c: 'Thermal Cooling System', sort_order: 3, qpa: 1, active: true, nha_partno_c: 'PN-THERMAL-CAM', is_sra: true },

    // Config 7: Laser Designator Config (cfg_set_id: 7, partno: PN-LASER-SYS)
    { list_id: 22, cfg_set_id: 7, partno_p: 'PN-LASER-SYS', partno_c: 'PN-LASER-DIODE', part_name_c: 'High-Power Laser Diode', sort_order: 1, qpa: 1, active: true, nha_partno_c: null, is_sra: false },
    { list_id: 23, cfg_set_id: 7, partno_p: 'PN-LASER-SYS', partno_c: 'PN-OPTICS-ASM', part_name_c: 'Beam Optics Assembly', sort_order: 2, qpa: 1, active: true, nha_partno_c: 'PN-LASER-DIODE', is_sra: true },
  ];
}

// Mutable array of BOM items
let bomItems: BOMItem[] = initializeBOMItems();

// =====================================
// SOFTWARE VERSION TRACKING
// =====================================

// Software catalog interface
interface Software {
  sw_id: number;
  sw_number: string;
  sw_type: string;
  sys_id: string;
  revision: string;
  revision_date: string;
  sw_title: string;
  sw_desc: string | null;
  eff_date: string;
  cpin_flag: boolean;
  active: boolean;
  pgm_id: number;
}

// Configuration-Software association interface
interface ConfigurationSoftware {
  cfg_sw_id: number;
  cfg_set_id: number;
  sw_id: number;
  eff_date: string;
  ins_by: string;
  ins_date: string;
}

// Initialize mock software catalog data
function initializeSoftware(): Software[] {
  const today = new Date();
  const subtractDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  return [
    // CRIIS program software (pgm_id: 1)
    {
      sw_id: 1,
      sw_number: 'SW-CAM-CTRL-001',
      sw_type: 'FIRMWARE',
      sys_id: 'CRIIS-CAMERA',
      revision: '2.1.5',
      revision_date: subtractDays(30),
      sw_title: 'Camera Control Software',
      sw_desc: 'Primary camera control firmware for image capture and processing',
      eff_date: subtractDays(30),
      cpin_flag: true,
      active: true,
      pgm_id: 1,
    },
    {
      sw_id: 2,
      sw_number: 'SW-CAM-CTRL-002',
      sw_type: 'FIRMWARE',
      sys_id: 'CRIIS-CAMERA',
      revision: '2.0.8',
      revision_date: subtractDays(120),
      sw_title: 'Camera Control Software (Legacy)',
      sw_desc: 'Previous version of camera control firmware',
      eff_date: subtractDays(120),
      cpin_flag: true,
      active: true,
      pgm_id: 1,
    },
    {
      sw_id: 3,
      sw_number: 'SW-RADAR-DSP-001',
      sw_type: 'DSP',
      sys_id: 'CRIIS-RADAR',
      revision: '3.4.2',
      revision_date: subtractDays(45),
      sw_title: 'Radar Signal Processing',
      sw_desc: 'Digital signal processing software for radar systems',
      eff_date: subtractDays(45),
      cpin_flag: true,
      active: true,
      pgm_id: 1,
    },
    {
      sw_id: 4,
      sw_number: 'SW-COMM-ENC-001',
      sw_type: 'APPLICATION',
      sys_id: 'CRIIS-COMM',
      revision: '4.0.1',
      revision_date: subtractDays(15),
      sw_title: 'Communication Encryption Module',
      sw_desc: 'Secure communication encryption software',
      eff_date: subtractDays(15),
      cpin_flag: true,
      active: true,
      pgm_id: 1,
    },
    {
      sw_id: 5,
      sw_number: 'SW-NAV-GPS-001',
      sw_type: 'FIRMWARE',
      sys_id: 'CRIIS-NAV',
      revision: '1.8.3',
      revision_date: subtractDays(90),
      sw_title: 'GPS Navigation Software',
      sw_desc: 'GPS positioning and navigation algorithms',
      eff_date: subtractDays(90),
      cpin_flag: false,
      active: true,
      pgm_id: 1,
    },
    {
      sw_id: 6,
      sw_number: 'SW-NAV-INS-001',
      sw_type: 'FIRMWARE',
      sys_id: 'CRIIS-NAV',
      revision: '2.2.1',
      revision_date: subtractDays(60),
      sw_title: 'Inertial Navigation Software',
      sw_desc: 'Inertial navigation system integration software',
      eff_date: subtractDays(60),
      cpin_flag: false,
      active: true,
      pgm_id: 1,
    },
    // ACTS program software (pgm_id: 2)
    {
      sw_id: 7,
      sw_number: 'SW-TGT-CTRL-001',
      sw_type: 'APPLICATION',
      sys_id: 'ACTS-TARGET',
      revision: '5.1.0',
      revision_date: subtractDays(20),
      sw_title: 'Targeting Control Software',
      sw_desc: 'Primary targeting system control software',
      eff_date: subtractDays(20),
      cpin_flag: true,
      active: true,
      pgm_id: 2,
    },
    {
      sw_id: 8,
      sw_number: 'SW-LASER-CAL-001',
      sw_type: 'FIRMWARE',
      sys_id: 'ACTS-LASER',
      revision: '1.3.7',
      revision_date: subtractDays(75),
      sw_title: 'Laser Calibration Firmware',
      sw_desc: 'Laser designator calibration and control firmware',
      eff_date: subtractDays(75),
      cpin_flag: true,
      active: true,
      pgm_id: 2,
    },
    {
      sw_id: 9,
      sw_number: 'SW-THERM-IMG-001',
      sw_type: 'DSP',
      sys_id: 'ACTS-THERMAL',
      revision: '2.5.4',
      revision_date: subtractDays(50),
      sw_title: 'Thermal Imaging Processor',
      sw_desc: 'Thermal image processing and enhancement software',
      eff_date: subtractDays(50),
      cpin_flag: false,
      active: true,
      pgm_id: 2,
    },
    // ARDS program software (pgm_id: 3)
    {
      sw_id: 10,
      sw_number: 'SW-RECON-DATA-001',
      sw_type: 'APPLICATION',
      sys_id: 'ARDS-RECON',
      revision: '3.0.2',
      revision_date: subtractDays(35),
      sw_title: 'Reconnaissance Data Handler',
      sw_desc: 'Data handling and transmission software for reconnaissance systems',
      eff_date: subtractDays(35),
      cpin_flag: true,
      active: true,
      pgm_id: 3,
    },
  ];
}

// Initialize mock configuration-software associations
function initializeConfigSoftware(): ConfigurationSoftware[] {
  const today = new Date();
  const subtractDays = (days: number): string => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  return [
    // Camera System X Configuration (cfg_set_id: 1) has SW-CAM-CTRL-001
    { cfg_sw_id: 1, cfg_set_id: 1, sw_id: 1, eff_date: subtractDays(30).split('T')[0], ins_by: 'admin', ins_date: subtractDays(30) },
    // Radar Unit Configuration (cfg_set_id: 2) has SW-RADAR-DSP-001
    { cfg_sw_id: 2, cfg_set_id: 2, sw_id: 3, eff_date: subtractDays(45).split('T')[0], ins_by: 'admin', ins_date: subtractDays(45) },
    // Communication System Config (cfg_set_id: 3) has SW-COMM-ENC-001
    { cfg_sw_id: 3, cfg_set_id: 3, sw_id: 4, eff_date: subtractDays(15).split('T')[0], ins_by: 'depot_mgr', ins_date: subtractDays(15) },
    // Navigation Unit Standard (cfg_set_id: 4) has SW-NAV-GPS-001 and SW-NAV-INS-001
    { cfg_sw_id: 4, cfg_set_id: 4, sw_id: 5, eff_date: subtractDays(90).split('T')[0], ins_by: 'admin', ins_date: subtractDays(90) },
    { cfg_sw_id: 5, cfg_set_id: 4, sw_id: 6, eff_date: subtractDays(60).split('T')[0], ins_by: 'admin', ins_date: subtractDays(60) },
  ];
}

// Mutable arrays for software tracking
const softwareCatalog: Software[] = initializeSoftware();
let configSoftware: ConfigurationSoftware[] = initializeConfigSoftware();
let nextCfgSwId = 6; // Next ID for new configuration-software associations

// GET /api/software - List all software for a program (requires authentication)
app.get('/api/software', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get optional query parameters
  const programId = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;
  const search = req.query.search as string || '';
  const swType = req.query.type as string || '';

  // Filter software by user's programs and optional filters
  let filteredSoftware = softwareCatalog.filter(sw => {
    // Program access check
    if (user.role === 'ADMIN') {
      // Admin can see all, but filter by programId if specified
      if (programId && sw.pgm_id !== programId) return false;
    } else {
      if (programId) {
        if (!userProgramIds.includes(programId) || sw.pgm_id !== programId) return false;
      } else {
        if (!userProgramIds.includes(sw.pgm_id)) return false;
      }
    }

    // Search filter (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        sw.sw_number.toLowerCase().includes(searchLower) ||
        sw.sw_title.toLowerCase().includes(searchLower) ||
        sw.revision.toLowerCase().includes(searchLower) ||
        (sw.sw_desc && sw.sw_desc.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Type filter
    if (swType && sw.sw_type !== swType) return false;

    // Only active software
    if (!sw.active) return false;

    return true;
  });

  // Add program info to each software
  const softwareWithProgram = filteredSoftware.map(sw => {
    const program = allPrograms.find(p => p.pgm_id === sw.pgm_id);
    return {
      ...sw,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    };
  });

  res.json({
    software: softwareWithProgram,
    total: softwareWithProgram.length,
  });
});

// GET /api/configurations/:id/software - Get software associations for a configuration
app.get('/api/configurations/:id/software', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const configId = parseInt(req.params.id, 10);
  if (isNaN(configId)) {
    return res.status(400).json({ error: 'Invalid configuration ID' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Get software associations for this configuration
  const associations = configSoftware.filter(cs => cs.cfg_set_id === configId);

  // Map associations to include full software details
  const softwareList = associations.map(assoc => {
    const sw = softwareCatalog.find(s => s.sw_id === assoc.sw_id);
    if (!sw) return null;
    return {
      cfg_sw_id: assoc.cfg_sw_id,
      sw_id: sw.sw_id,
      sw_number: sw.sw_number,
      sw_type: sw.sw_type,
      revision: sw.revision,
      revision_date: sw.revision_date,
      sw_title: sw.sw_title,
      sw_desc: sw.sw_desc,
      cpin_flag: sw.cpin_flag,
      eff_date: assoc.eff_date,
      ins_by: assoc.ins_by,
      ins_date: assoc.ins_date,
    };
  }).filter(Boolean);

  res.json({
    configuration: {
      cfg_set_id: config.cfg_set_id,
      cfg_name: config.cfg_name,
    },
    software: softwareList,
    total: softwareList.length,
  });
});

// POST /api/configurations/:id/software - Add software to a configuration
app.post('/api/configurations/:id/software', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can add software associations
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to modify configuration software' });
  }

  const configId = parseInt(req.params.id, 10);
  if (isNaN(configId)) {
    return res.status(400).json({ error: 'Invalid configuration ID' });
  }

  // Validate request body
  const { sw_id, eff_date } = req.body;
  if (!sw_id || typeof sw_id !== 'number') {
    return res.status(400).json({ error: 'Software ID is required' });
  }
  if (!eff_date) {
    return res.status(400).json({ error: 'Effective date is required' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Find the software
  const sw = softwareCatalog.find(s => s.sw_id === sw_id);
  if (!sw) {
    return res.status(404).json({ error: 'Software not found' });
  }

  // Check if association already exists
  const existingAssoc = configSoftware.find(cs => cs.cfg_set_id === configId && cs.sw_id === sw_id);
  if (existingAssoc) {
    return res.status(400).json({ error: 'This software is already associated with this configuration' });
  }

  // Create new association
  const newAssociation: ConfigurationSoftware = {
    cfg_sw_id: nextCfgSwId++,
    cfg_set_id: configId,
    sw_id: sw_id,
    eff_date: eff_date,
    ins_by: user.username,
    ins_date: new Date().toISOString(),
  };

  configSoftware.push(newAssociation);

  console.log(`[CONFIG-SW] Added software "${sw.sw_number}" (${sw.sw_title}) to config "${config.cfg_name}" (ID: ${configId}) by ${user.username}`);

  res.status(201).json({
    message: 'Software added to configuration successfully',
    association: {
      cfg_sw_id: newAssociation.cfg_sw_id,
      sw_id: sw.sw_id,
      sw_number: sw.sw_number,
      sw_type: sw.sw_type,
      revision: sw.revision,
      sw_title: sw.sw_title,
      eff_date: newAssociation.eff_date,
      ins_by: newAssociation.ins_by,
      ins_date: newAssociation.ins_date,
    },
  });
});

// DELETE /api/configurations/:id/software/:swAssocId - Remove software from a configuration
app.delete('/api/configurations/:id/software/:swAssocId', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can remove software associations
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to modify configuration software' });
  }

  const configId = parseInt(req.params.id, 10);
  const swAssocId = parseInt(req.params.swAssocId, 10);

  if (isNaN(configId) || isNaN(swAssocId)) {
    return res.status(400).json({ error: 'Invalid configuration ID or software association ID' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check program access
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Find the association
  const assocIndex = configSoftware.findIndex(cs => cs.cfg_sw_id === swAssocId && cs.cfg_set_id === configId);
  if (assocIndex === -1) {
    return res.status(404).json({ error: 'Software association not found' });
  }

  // Get association details before removing
  const removedAssoc = configSoftware[assocIndex];
  const sw = softwareCatalog.find(s => s.sw_id === removedAssoc.sw_id);

  // Remove the association
  configSoftware.splice(assocIndex, 1);

  console.log(`[CONFIG-SW] Removed software "${sw?.sw_number || 'unknown'}" from config "${config.cfg_name}" (ID: ${configId}) by ${user.username}`);

  res.json({
    message: 'Software removed from configuration successfully',
    removed: {
      cfg_sw_id: removedAssoc.cfg_sw_id,
      sw_id: removedAssoc.sw_id,
      sw_number: sw?.sw_number,
      sw_title: sw?.sw_title,
    },
  });
});

// GET /api/configurations - List all configurations for a program (requires authentication)
app.get('/api/configurations', (req, res) => {
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

  // Filter configurations by program and active status
  let filteredConfigs = configurations.filter(c => c.pgm_id === programIdFilter);

  // Apply active filter (default to showing only active)
  const showInactive = req.query.include_inactive === 'true';
  if (!showInactive) {
    filteredConfigs = filteredConfigs.filter(c => c.active);
  }

  // Apply type filter
  const typeFilter = req.query.type as string;
  if (typeFilter) {
    filteredConfigs = filteredConfigs.filter(c => c.cfg_type === typeFilter);
  }

  // Apply search filter
  const searchQuery = (req.query.search as string)?.toLowerCase();
  if (searchQuery) {
    filteredConfigs = filteredConfigs.filter(c =>
      c.cfg_name.toLowerCase().includes(searchQuery) ||
      c.partno?.toLowerCase().includes(searchQuery) ||
      c.part_name?.toLowerCase().includes(searchQuery) ||
      c.description?.toLowerCase().includes(searchQuery)
    );
  }

  // Apply sorting
  const sortBy = (req.query.sort_by as string) || 'cfg_name';
  const sortOrder = (req.query.sort_order as string) || 'asc';

  filteredConfigs.sort((a, b) => {
    let aVal: string | number = '';
    let bVal: string | number = '';

    switch (sortBy) {
      case 'cfg_name':
        aVal = a.cfg_name.toLowerCase();
        bVal = b.cfg_name.toLowerCase();
        break;
      case 'cfg_type':
        aVal = a.cfg_type.toLowerCase();
        bVal = b.cfg_type.toLowerCase();
        break;
      case 'partno':
        aVal = (a.partno || '').toLowerCase();
        bVal = (b.partno || '').toLowerCase();
        break;
      case 'bom_item_count':
        aVal = a.bom_item_count;
        bVal = b.bom_item_count;
        break;
      case 'asset_count':
        aVal = a.asset_count;
        bVal = b.asset_count;
        break;
      case 'ins_date':
        aVal = new Date(a.ins_date).getTime();
        bVal = new Date(b.ins_date).getTime();
        break;
      default:
        aVal = a.cfg_name.toLowerCase();
        bVal = b.cfg_name.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedConfigs = filteredConfigs.slice(startIndex, endIndex);

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === programIdFilter);

  console.log(`[CONFIGS] List request by ${user.username} for program ${program?.pgm_cd} - Total: ${filteredConfigs.length}, Page: ${page}`);

  res.json({
    configurations: paginatedConfigs,
    pagination: {
      page,
      limit,
      total: filteredConfigs.length,
      total_pages: Math.ceil(filteredConfigs.length / limit),
    },
    program: {
      pgm_id: program?.pgm_id || programIdFilter,
      pgm_cd: program?.pgm_cd || 'UNKNOWN',
      pgm_name: program?.pgm_name || 'Unknown Program',
    },
  });
});

// GET /api/configurations/:id - Get single configuration by ID (requires authentication)
app.get('/api/configurations/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const configId = parseInt(req.params.id, 10);
  const config = configurations.find(c => c.cfg_set_id === configId);

  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check if user has access to this configuration's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === config.pgm_id);

  console.log(`[CONFIGS] Detail request for config ${config.cfg_name} by ${user.username}`);

  res.json({
    configuration: {
      ...config,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    },
  });
});

// GET /api/configurations/:id/bom - Get BOM (Bill of Materials) for a configuration (requires authentication)
app.get('/api/configurations/:id/bom', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const configId = parseInt(req.params.id, 10);
  const config = configurations.find(c => c.cfg_set_id === configId);

  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check if user has access to this configuration's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Get BOM items for this configuration, sorted by sort_order
  const configBomItems = bomItems
    .filter(bom => bom.cfg_set_id === configId && bom.active)
    .sort((a, b) => a.sort_order - b.sort_order);

  console.log(`[CONFIGS] BOM request for config ${config.cfg_name} by ${user.username} - ${configBomItems.length} items`);

  res.json({
    bom_items: configBomItems,
    total: configBomItems.length,
    configuration: {
      cfg_set_id: config.cfg_set_id,
      cfg_name: config.cfg_name,
      partno: config.partno,
    },
  });
});

// PUT /api/configurations/:id - Update configuration (requires depot_manager or admin)
app.put('/api/configurations/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can edit configurations
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to edit configurations' });
  }

  const configId = parseInt(req.params.id, 10);
  const configIndex = configurations.findIndex(c => c.cfg_set_id === configId);

  if (configIndex === -1) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  const config = configurations[configIndex];

  // Check if user has access to this configuration's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Extract updatable fields from request body
  const { cfg_name, cfg_type, description, active } = req.body;

  // Validation
  if (cfg_name !== undefined && (typeof cfg_name !== 'string' || cfg_name.trim().length === 0)) {
    return res.status(400).json({ error: 'Configuration name cannot be empty' });
  }

  if (cfg_type !== undefined && !['ASSEMBLY', 'SYSTEM', 'COMPONENT'].includes(cfg_type)) {
    return res.status(400).json({ error: 'Invalid configuration type. Must be ASSEMBLY, SYSTEM, or COMPONENT' });
  }

  // Store old values for audit logging
  const oldValues = {
    cfg_name: config.cfg_name,
    cfg_type: config.cfg_type,
    description: config.description,
    active: config.active,
  };

  // Update fields
  if (cfg_name !== undefined) {
    config.cfg_name = cfg_name.trim();
  }
  if (cfg_type !== undefined) {
    config.cfg_type = cfg_type;
  }
  if (description !== undefined) {
    config.description = description?.trim() || null;
  }
  if (active !== undefined) {
    config.active = Boolean(active);
  }

  // Update audit fields
  config.chg_by = user.username;
  config.chg_date = new Date().toISOString();

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === config.pgm_id);

  console.log(`[CONFIGS] Updated config ${config.cfg_name} (ID: ${configId}) by ${user.username}`);
  console.log(`[CONFIGS] Old values:`, oldValues);
  console.log(`[CONFIGS] New values:`, { cfg_name: config.cfg_name, cfg_type: config.cfg_type, description: config.description, active: config.active });

  res.json({
    message: 'Configuration updated successfully',
    configuration: {
      ...config,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    },
  });
});

// GET /api/reference/parts - Get available part numbers for configuration forms
app.get('/api/reference/parts', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get program filter from query string
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

  // Mock part numbers for the program (in real app, this would come from part_list table)
  const mockParts = [
    { partno_id: 1, partno: 'PN-SENSOR-A', name: 'Sensor Unit A', pgm_id: 1 },
    { partno_id: 2, partno: 'PN-SENSOR-B', name: 'Sensor Unit B', pgm_id: 1 },
    { partno_id: 3, partno: 'PN-SENSOR-C', name: 'Sensor Unit C', pgm_id: 1 },
    { partno_id: 4, partno: 'PN-CAMERA-X', name: 'Camera System X', pgm_id: 1 },
    { partno_id: 5, partno: 'PN-CAMERA-Y', name: 'Camera System Y', pgm_id: 1 },
    { partno_id: 6, partno: 'PN-RADAR-01', name: 'Radar Unit 01', pgm_id: 1 },
    { partno_id: 7, partno: 'PN-RADAR-02', name: 'Radar Unit 02', pgm_id: 1 },
    { partno_id: 8, partno: 'PN-COMM-SYS', name: 'Communication System', pgm_id: 1 },
    { partno_id: 9, partno: 'PN-POWER-MOD', name: 'Power Module', pgm_id: 1 },
    { partno_id: 10, partno: 'PN-NAV-UNIT', name: 'Navigation Unit', pgm_id: 1 },
    { partno_id: 11, partno: 'PN-TARGET-A', name: 'Targeting System A', pgm_id: 2 },
    { partno_id: 12, partno: 'PN-TARGET-B', name: 'Targeting System B', pgm_id: 2 },
    { partno_id: 13, partno: 'PN-TARGET-C', name: 'Targeting System C', pgm_id: 2 },
    { partno_id: 14, partno: 'PN-OPTICS-A', name: 'Optical System A', pgm_id: 2 },
    { partno_id: 15, partno: 'PN-LASER-01', name: 'Laser Designator 01', pgm_id: 2 },
    { partno_id: 16, partno: 'PN-RECON-A', name: 'Reconnaissance Unit A', pgm_id: 3 },
    { partno_id: 17, partno: 'PN-RECON-B', name: 'Reconnaissance Unit B', pgm_id: 3 },
    { partno_id: 18, partno: 'PN-DATA-SYS', name: 'Data Processing System', pgm_id: 3 },
    { partno_id: 19, partno: 'PN-236-CTRL', name: '236 Control Unit', pgm_id: 4 },
    { partno_id: 20, partno: 'PN-236-PROC', name: '236 Processor Module', pgm_id: 4 },
  ];

  // Filter parts by program
  const filteredParts = mockParts.filter(p => p.pgm_id === programIdFilter);

  res.json({
    parts: filteredParts,
    total: filteredParts.length,
  });
});

// POST /api/configurations - Create new configuration (requires depot_manager or admin)
app.post('/api/configurations', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can create configurations
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to create configurations' });
  }

  const { cfg_name, cfg_type, partno_id, partno, part_name, description, pgm_id } = req.body;

  // Validation
  if (!cfg_name || typeof cfg_name !== 'string' || cfg_name.trim().length === 0) {
    return res.status(400).json({ error: 'Configuration name is required' });
  }

  if (!cfg_type || !['ASSEMBLY', 'SYSTEM', 'COMPONENT'].includes(cfg_type)) {
    return res.status(400).json({ error: 'Configuration type is required and must be ASSEMBLY, SYSTEM, or COMPONENT' });
  }

  // Determine program ID
  const targetPgmId = pgm_id || user.programs.find(p => p.is_default)?.pgm_id || user.programs[0]?.pgm_id || 1;

  // Check if user has access to target program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(targetPgmId) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this program' });
  }

  // Check for duplicate configuration name in same program
  const existingConfig = configurations.find(
    c => c.cfg_name.toLowerCase() === cfg_name.trim().toLowerCase() && c.pgm_id === targetPgmId
  );
  if (existingConfig) {
    return res.status(400).json({ error: 'A configuration with this name already exists in this program' });
  }

  // Generate new ID
  const newId = Math.max(...configurations.map(c => c.cfg_set_id), 0) + 1;

  // Create new configuration
  const newConfig: ConfigurationSet = {
    cfg_set_id: newId,
    cfg_name: cfg_name.trim(),
    cfg_type,
    pgm_id: targetPgmId,
    partno_id: partno_id || null,
    partno: partno || null,
    part_name: part_name || null,
    description: description?.trim() || null,
    active: true,
    ins_by: user.username,
    ins_date: new Date().toISOString(),
    chg_by: null,
    chg_date: null,
    bom_item_count: 0,
    asset_count: 0,
  };

  // Add to configurations array
  configurations.push(newConfig);

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === targetPgmId);

  console.log(`[CONFIGS] Created new config "${newConfig.cfg_name}" (ID: ${newId}) by ${user.username} for program ${program?.pgm_cd}`);

  res.status(201).json({
    message: 'Configuration created successfully',
    configuration: {
      ...newConfig,
      program_cd: program?.pgm_cd || 'UNKNOWN',
      program_name: program?.pgm_name || 'Unknown Program',
    },
  });
});

// DELETE /api/configurations/:id - Delete configuration (requires depot_manager or admin)
app.delete('/api/configurations/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can delete configurations
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to delete configurations' });
  }

  const configId = parseInt(req.params.id, 10);
  if (isNaN(configId)) {
    return res.status(400).json({ error: 'Invalid configuration ID' });
  }

  const configIndex = configurations.findIndex(c => c.cfg_set_id === configId);
  if (configIndex === -1) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  const config = configurations[configIndex];

  // Check if user has access to this program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Check if configuration has linked assets
  if (config.asset_count > 0) {
    return res.status(400).json({
      error: `Cannot delete configuration with linked assets. This configuration has ${config.asset_count} asset(s) linked to it. Please unlink all assets before deleting.`
    });
  }

  // Remove from configurations array
  const deletedConfig = configurations.splice(configIndex, 1)[0];

  // Get program info
  const program = allPrograms.find(p => p.pgm_id === deletedConfig.pgm_id);

  console.log(`[CONFIGS] Deleted config "${deletedConfig.cfg_name}" (ID: ${configId}) by ${user.username} from program ${program?.pgm_cd}`);

  res.json({
    message: 'Configuration deleted successfully',
    configuration: {
      cfg_set_id: deletedConfig.cfg_set_id,
      cfg_name: deletedConfig.cfg_name,
      cfg_type: deletedConfig.cfg_type,
    },
  });
});

// POST /api/configurations/:id/bom - Add a part to configuration BOM
app.post('/api/configurations/:id/bom', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can add BOM items
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to modify BOM' });
  }

  const configId = parseInt(req.params.id, 10);
  if (isNaN(configId)) {
    return res.status(400).json({ error: 'Invalid configuration ID' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check if user has access to this program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Validate request body
  const { partno_c, part_name_c, qpa, sort_order, nha_partno_c } = req.body;

  if (!partno_c || typeof partno_c !== 'string' || partno_c.trim() === '') {
    return res.status(400).json({ error: 'Child part number is required' });
  }

  if (!part_name_c || typeof part_name_c !== 'string' || part_name_c.trim() === '') {
    return res.status(400).json({ error: 'Child part name is required' });
  }

  const qpaValue = parseInt(qpa, 10);
  if (isNaN(qpaValue) || qpaValue < 1) {
    return res.status(400).json({ error: 'Quantity per assembly must be at least 1' });
  }

  const sortOrderValue = parseInt(sort_order, 10) || (bomItems.filter(b => b.cfg_set_id === configId).length + 1);

  // Validate NHA parent if provided
  let validatedNhaPartno: string | null = null;
  if (nha_partno_c && typeof nha_partno_c === 'string' && nha_partno_c.trim() !== '') {
    // VALIDATION 1: Check configuration type compatibility
    // COMPONENT type configurations should not have complex NHA hierarchies
    if (config.cfg_type === 'COMPONENT') {
      return res.status(400).json({
        error: 'Incompatible part type: COMPONENT configurations cannot have NHA parent relationships. Only ASSEMBLY and SYSTEM configurations support hierarchical BOM structures.',
        validation_type: 'incompatible_type'
      });
    }

    // Check if the NHA parent exists in this configuration's BOM
    const nhaParent = bomItems.find(
      item => item.cfg_set_id === configId && item.partno_c === nha_partno_c.trim()
    );
    if (!nhaParent) {
      return res.status(400).json({ error: 'NHA parent part not found in this configuration\'s BOM' });
    }

    // VALIDATION 2: Circular reference detection
    // Check if the proposed parent (nha_partno_c) is already a child of the new part (partno_c)
    // This would create a circular reference: A -> B -> A
    const checkCircularReference = (childPartno: string, potentialParentPartno: string, visited: Set<string> = new Set()): boolean => {
      // If we've already visited this part, we have a cycle
      if (visited.has(childPartno)) {
        return true;
      }
      visited.add(childPartno);

      // Find all parts that have this childPartno as their NHA parent
      const childrenOfChild = bomItems.filter(
        item => item.cfg_set_id === configId && item.nha_partno_c === childPartno
      );

      for (const child of childrenOfChild) {
        // If any of childPartno's children is the potentialParent, we have a circular reference
        if (child.partno_c === potentialParentPartno) {
          return true;
        }
        // Recursively check deeper levels
        if (checkCircularReference(child.partno_c, potentialParentPartno, visited)) {
          return true;
        }
      }

      return false;
    };

    // Check if the new part (partno_c) has any existing children that include the proposed parent
    // This handles the case where we're adding a new part with a parent, and the new part
    // would already have children that reference the parent (creating A -> B -> A)
    // Also check if the proposed parent has the new part as an ancestor
    const existingChildrenOfNewPart = bomItems.filter(
      item => item.cfg_set_id === configId && item.nha_partno_c === partno_c.trim()
    );

    // Check if nha_partno_c appears anywhere in the descendants of partno_c
    if (existingChildrenOfNewPart.length > 0) {
      // New part already exists and has children - check for circular ref
      if (checkCircularReference(partno_c.trim(), nha_partno_c.trim())) {
        return res.status(400).json({
          error: `Circular reference detected: Cannot set "${nha_partno_c.trim()}" as parent of "${partno_c.trim()}" because it would create a circular dependency in the assembly hierarchy.`,
          validation_type: 'circular_reference'
        });
      }
    }

    // Also check the reverse - if the proposed parent already has this part as an ancestor
    const checkAncestors = (partno: string, targetAncestor: string, visited: Set<string> = new Set()): boolean => {
      if (visited.has(partno)) return false;
      visited.add(partno);

      const item = bomItems.find(b => b.cfg_set_id === configId && b.partno_c === partno);
      if (!item || !item.nha_partno_c) return false;

      if (item.nha_partno_c === targetAncestor) return true;

      return checkAncestors(item.nha_partno_c, targetAncestor, visited);
    };

    // Check if nha_partno_c already has partno_c as an ancestor (would mean partno_c -> ... -> nha_partno_c -> partno_c)
    if (checkAncestors(nha_partno_c.trim(), partno_c.trim())) {
      return res.status(400).json({
        error: `Circular reference detected: "${partno_c.trim()}" is already an ancestor of "${nha_partno_c.trim()}" in the assembly hierarchy. Setting this parent relationship would create a circular dependency.`,
        validation_type: 'circular_reference'
      });
    }

    validatedNhaPartno = nha_partno_c.trim();
  }

  // Check for duplicate part in this configuration
  const existingItem = bomItems.find(
    item => item.cfg_set_id === configId && item.partno_c === partno_c.trim()
  );
  if (existingItem) {
    return res.status(400).json({ error: 'This part is already in the BOM for this configuration' });
  }

  // Generate new list_id
  const newListId = Math.max(...bomItems.map(b => b.list_id), 0) + 1;

  // Create new BOM item
  const newBomItem: BOMItem = {
    list_id: newListId,
    cfg_set_id: configId,
    partno_p: config.partno || config.cfg_name,
    partno_c: partno_c.trim(),
    part_name_c: part_name_c.trim(),
    sort_order: sortOrderValue,
    qpa: qpaValue,
    active: true,
    nha_partno_c: validatedNhaPartno,
    is_sra: validatedNhaPartno !== null,
  };

  // Add to bomItems array
  bomItems.push(newBomItem);

  // Update configuration bom_item_count
  config.bom_item_count = bomItems.filter(b => b.cfg_set_id === configId).length;

  console.log(`[BOM] Added part "${partno_c}" to config "${config.cfg_name}" (ID: ${configId}) by ${user.username}`);

  res.status(201).json({
    message: 'Part added to BOM successfully',
    bom_item: newBomItem,
    bom_item_count: config.bom_item_count,
  });
});

// PUT /api/configurations/:id/bom/:itemId - Update a BOM item (including NHA relationship)
app.put('/api/configurations/:id/bom/:itemId', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can update BOM items
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to modify BOM' });
  }

  const configId = parseInt(req.params.id, 10);
  const itemId = parseInt(req.params.itemId, 10);

  if (isNaN(configId) || isNaN(itemId)) {
    return res.status(400).json({ error: 'Invalid configuration ID or item ID' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check if user has access to this program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Find the BOM item
  const bomItem = bomItems.find(item => item.list_id === itemId && item.cfg_set_id === configId);
  if (!bomItem) {
    return res.status(404).json({ error: 'BOM item not found' });
  }

  // Extract updatable fields from request body
  const { nha_partno_c, qpa, sort_order } = req.body;

  // Update NHA relationship if provided
  if (nha_partno_c !== undefined) {
    if (nha_partno_c === null || nha_partno_c === '') {
      // Clear NHA relationship
      bomItem.nha_partno_c = null;
      bomItem.is_sra = false;
    } else {
      // Check if the NHA parent exists in this configuration's BOM
      const nhaParent = bomItems.find(
        item => item.cfg_set_id === configId && item.partno_c === nha_partno_c.trim() && item.list_id !== itemId
      );
      if (!nhaParent) {
        return res.status(400).json({ error: 'NHA parent part not found in this configuration\'s BOM' });
      }
      // Prevent circular references - check if the proposed parent is already a child of this item
      const isCircular = bomItems.some(
        item => item.cfg_set_id === configId && item.nha_partno_c === bomItem.partno_c && item.partno_c === nha_partno_c.trim()
      );
      if (isCircular) {
        return res.status(400).json({ error: 'Cannot set NHA parent: would create circular reference' });
      }
      bomItem.nha_partno_c = nha_partno_c.trim();
      bomItem.is_sra = true;
    }
  }

  // Update QPA if provided
  if (qpa !== undefined) {
    const qpaValue = parseInt(qpa, 10);
    if (isNaN(qpaValue) || qpaValue < 1) {
      return res.status(400).json({ error: 'Quantity per assembly must be at least 1' });
    }
    bomItem.qpa = qpaValue;
  }

  // Update sort order if provided
  if (sort_order !== undefined) {
    const sortOrderValue = parseInt(sort_order, 10);
    if (!isNaN(sortOrderValue) && sortOrderValue >= 1) {
      bomItem.sort_order = sortOrderValue;
    }
  }

  console.log(`[BOM] Updated item ${itemId} in config "${config.cfg_name}" (ID: ${configId}) by ${user.username}`);

  res.json({
    message: 'BOM item updated successfully',
    bom_item: bomItem,
  });
});

// DELETE /api/configurations/:id/bom/:itemId - Remove a part from configuration BOM
app.delete('/api/configurations/:id/bom/:itemId', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Check authorization - only admin and depot_manager can remove BOM items
  if (!['ADMIN', 'DEPOT_MANAGER'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to modify BOM' });
  }

  const configId = parseInt(req.params.id, 10);
  const itemId = parseInt(req.params.itemId, 10);

  if (isNaN(configId) || isNaN(itemId)) {
    return res.status(400).json({ error: 'Invalid configuration ID or item ID' });
  }

  // Find the configuration
  const config = configurations.find(c => c.cfg_set_id === configId);
  if (!config) {
    return res.status(404).json({ error: 'Configuration not found' });
  }

  // Check if user has access to this program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(config.pgm_id) && user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied to this configuration' });
  }

  // Find the BOM item
  const itemIndex = bomItems.findIndex(item => item.list_id === itemId && item.cfg_set_id === configId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'BOM item not found' });
  }

  // Remove the item
  const removedItem = bomItems.splice(itemIndex, 1)[0];

  // Update configuration bom_item_count
  config.bom_item_count = bomItems.filter(b => b.cfg_set_id === configId).length;

  console.log(`[BOM] Removed part "${removedItem.partno_c}" from config "${config.cfg_name}" (ID: ${configId}) by ${user.username}`);

  res.json({
    message: 'Part removed from BOM successfully',
    removed_item: removedItem,
    bom_item_count: config.bom_item_count,
  });
});

// ============================================
// SORTIE ENDPOINTS
// ============================================

// List sorties (requires authentication)
app.get('/api/sorties', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Get user's program IDs
  const userProgramIds = user.programs.map(p => p.pgm_id);

  // Get query parameters
  const programIdFilter = req.query.program_id ? parseInt(req.query.program_id as string, 10) : null;

  // Filter by user's accessible programs
  let filteredSorties = sorties.filter(s => userProgramIds.includes(s.pgm_id));

  // Apply program filter if specified
  if (programIdFilter && userProgramIds.includes(programIdFilter)) {
    filteredSorties = filteredSorties.filter(s => s.pgm_id === programIdFilter);
  }

  // Sort by date descending (newest first)
  filteredSorties.sort((a, b) => new Date(b.sortie_date).getTime() - new Date(a.sortie_date).getTime());

  console.log(`[SORTIES] List request by ${user.username} - Total: ${filteredSorties.length}`);

  res.json({
    sorties: filteredSorties,
    total: filteredSorties.length,
  });
});

// Get single sortie by ID
app.get('/api/sorties/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const sortieId = parseInt(req.params.id, 10);
  const sortie = sorties.find(s => s.sortie_id === sortieId);

  if (!sortie) {
    return res.status(404).json({ error: 'Sortie not found' });
  }

  // Check if user has access to this sortie's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(sortie.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this sortie' });
  }

  // Get linked maintenance events for this sortie
  const linkedEvents = maintenanceEvents.filter(e => e.sortie_id === sortieId);

  res.json({
    sortie,
    linked_events: linkedEvents,
    linked_events_count: linkedEvents.length,
  });
});

// Create new sortie (requires field_technician or higher)
app.post('/api/sorties', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Authorization: Only field_technician, depot_manager, and admin can create sorties
  if (!['field_technician', 'depot_manager', 'admin'].includes(user.role_cd)) {
    return res.status(403).json({ error: 'Insufficient permissions to create sortie' });
  }

  // Validate required fields
  const {
    asset_id,
    mission_id,
    sortie_date,
    sortie_effect,
    range,
    remarks
  } = req.body;

  if (!asset_id || !mission_id || !sortie_date) {
    return res.status(400).json({ error: 'Missing required fields: asset_id, mission_id, sortie_date' });
  }

  // Find the asset and validate
  const asset = mockAssets.find(a => a.asset_id === parseInt(asset_id, 10));
  if (!asset) {
    return res.status(400).json({ error: 'Invalid asset_id' });
  }

  // Check if user has access to this asset's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(asset.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this asset program' });
  }

  // Generate new sortie ID
  const newSortieId = sorties.length > 0 ? Math.max(...sorties.map(s => s.sortie_id)) + 1 : 1;

  // Create new sortie
  const newSortie: Sortie = {
    sortie_id: newSortieId,
    pgm_id: asset.pgm_id,
    asset_id: parseInt(asset_id, 10),
    mission_id: mission_id.trim(),
    serno: asset.serno,
    ac_tailno: asset.serno, // Use serno as tail number
    sortie_date: sortie_date,
    sortie_effect: sortie_effect || null,
    current_unit: user.programs.find(p => p.pgm_id === asset.pgm_id)?.pgm_cd || null,
    assigned_unit: user.programs.find(p => p.pgm_id === asset.pgm_id)?.pgm_cd || null,
    range: range || null,
    reason: null,
    remarks: remarks || null,
  };

  // Add to sorties array
  sorties.push(newSortie);

  console.log(`[SORTIES] Created new sortie #${newSortieId} by ${user.username} for asset ${asset.serno}`);

  res.status(201).json({
    sortie: newSortie,
    message: 'Sortie created successfully',
  });
});

// PUT /api/sorties/:id - Update existing sortie (requires field_technician or higher)
app.put('/api/sorties/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Authorization: Only field_technician, depot_manager, and admin can edit sorties
  if (!['FIELD_TECHNICIAN', 'DEPOT_MANAGER', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to edit sortie' });
  }

  const sortieId = parseInt(req.params.id, 10);
  const sortieIndex = sorties.findIndex(s => s.sortie_id === sortieId);

  if (sortieIndex === -1) {
    return res.status(404).json({ error: 'Sortie not found' });
  }

  const sortie = sorties[sortieIndex];

  // Check if user has access to this sortie's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(sortie.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this sortie program' });
  }

  // Update fields (allow partial updates)
  const {
    mission_id,
    sortie_date,
    sortie_effect,
    range,
    remarks,
    reason,
    current_unit,
    assigned_unit
  } = req.body;

  // Update sortie with new values
  const updatedSortie = {
    ...sortie,
    mission_id: mission_id !== undefined ? mission_id.trim() : sortie.mission_id,
    sortie_date: sortie_date !== undefined ? sortie_date : sortie.sortie_date,
    sortie_effect: sortie_effect !== undefined ? sortie_effect : sortie.sortie_effect,
    range: range !== undefined ? range : sortie.range,
    remarks: remarks !== undefined ? remarks : sortie.remarks,
    reason: reason !== undefined ? reason : sortie.reason,
    current_unit: current_unit !== undefined ? current_unit : sortie.current_unit,
    assigned_unit: assigned_unit !== undefined ? assigned_unit : sortie.assigned_unit,
  };

  sorties[sortieIndex] = updatedSortie;

  console.log(`[SORTIES] Updated sortie #${sortieId} by ${user.username}`);

  res.status(200).json({
    sortie: updatedSortie,
    message: 'Sortie updated successfully',
  });
});

// Delete sortie (requires depot_manager or admin)
app.delete('/api/sorties/:id', (req, res) => {
  const payload = authenticateRequest(req, res);
  if (!payload) return;

  const user = mockUsers.find(u => u.user_id === payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // Authorization: Only depot_manager and admin can delete sorties
  if (!['DEPOT_MANAGER', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions to delete sortie' });
  }

  const sortieId = parseInt(req.params.id, 10);
  const sortieIndex = sorties.findIndex(s => s.sortie_id === sortieId);

  if (sortieIndex === -1) {
    return res.status(404).json({ error: 'Sortie not found' });
  }

  const sortie = sorties[sortieIndex];

  // Check if user has access to this sortie's program
  const userProgramIds = user.programs.map(p => p.pgm_id);
  if (!userProgramIds.includes(sortie.pgm_id)) {
    return res.status(403).json({ error: 'Access denied to this sortie' });
  }

  // Remove the sortie
  sorties.splice(sortieIndex, 1);

  console.log(`[SORTIES] Deleted sortie #${sortieId} (${sortie.mission_id}) by ${user.username}`);

  res.json({
    message: 'Sortie deleted successfully',
    sortie_id: sortieId,
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
