import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment configuration on startup
console.log('\n🔧 =============== SERVER STARTUP ===============');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
console.log('===============================================\n');

// =====================
// Middleware
// =====================

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// =====================
// MongoDB Connection
// =====================

const connectDB = async () => {
  try {
    // ✅ Mongoose v8+ does not need useNewUrlParser or useUnifiedTopology
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// =====================
// Routes
// =====================// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error'
  });
});

// =====================
// Start Server
// =====================

app.listen(PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  🚀 Server is running on http://localhost:${PORT}`);
  console.log(`  📧 Make sure to set EMAIL_USER and EMAIL_PASSWORD in .env`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});


// Add this to your server.js file temporarily to diagnose issues
// Place it RIGHT AFTER your dotenv.config() line

console.log('\n🔍 =============== DIAGNOSTIC CHECK ===============');

// Check 1: Environment Variables
console.log('\n📋 Environment Variables:');
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'EMAIL_USER',
  'EMAIL_PASSWORD'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ MISSING: ${varName}`);
  } else {
    console.log(`✅ ${varName}: ${varName.includes('PASSWORD') || varName.includes('SECRET') ? '[HIDDEN]' : process.env[varName]}`);
  }
});

// Check 2: MongoDB URI Format
if (process.env.MONGODB_URI) {
  if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ MONGODB_URI format invalid - must start with mongodb:// or mongodb+srv://');
  } else {
    console.log('✅ MONGODB_URI format looks valid');
  }
}

// Check 3: Email Configuration
if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('@')) {
  console.error('❌ EMAIL_USER appears invalid - should be a full email address');
}

// Check 4: JWT Configuration
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  JWT_SECRET is short - recommend at least 32 characters for security');
}

console.log('\n===============================================\n');