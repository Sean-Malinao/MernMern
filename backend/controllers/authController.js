import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Configure email transporter
let transporter = null;
let emailConfigured = false;

const initializeEmailTransporter = () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  EMAIL_USER or EMAIL_PASSWORD not configured');
      return false;
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    emailConfigured = true;
    console.log('✓ Email transporter initialized');
    return true;
  } catch (error) {
    console.error('✗ Email transporter initialization failed:', error.message);
    return false;
  }
};

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  try {
    if (!initializeEmailTransporter()) {
      return false;
    }

    await transporter.verify();
    console.log('✓ Email configuration verified');
    emailConfigured = true;
    return true;
  } catch (error) {
    console.error('✗ Email configuration error:', error.message);
    emailConfigured = false;
    return false;
  }
};

// Verify on module load
verifyEmailConfig();

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured in environment variables');
  }
  
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send OTP via Email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 [EMAIL] Starting email send process...');
    console.log('📧 [EMAIL] Transporter exists:', !!transporter);
    console.log('📧 [EMAIL] Email configured:', emailConfigured);
    
    // Initialize transporter if not already done
    if (!transporter) {
      console.log('📧 [EMAIL] Initializing transporter...');
      initializeEmailTransporter();
    }

    if (!transporter) {
      throw new Error('Failed to initialize email transporter. Check EMAIL_USER and EMAIL_PASSWORD in .env file');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Do not share this OTP with anyone.</p>
        </div>
      `
    };

    console.log('📧 [EMAIL] Sending mail to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [EMAIL] Email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL] Error sending OTP email:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check EMAIL_USER and EMAIL_PASSWORD are correct and using App Password for Gmail');
    } else if (error.code === 'ESOCKET') {
      throw new Error('Email connection failed. Please check your internet connection');
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// @desc    Sign up and send OTP
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    console.log('\n📝 [SIGNUP] ============ NEW SIGNUP REQUEST ============');
    console.log('📝 [SIGNUP] Body received:', { ...req.body, password: '[HIDDEN]', confirmPassword: '[HIDDEN]' });
    
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.warn('⚠️  [SIGNUP] Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        missing: {
          firstName: !firstName,
          lastName: !lastName,
          email: !email,
          password: !password,
          confirmPassword: !confirmPassword
        }
      });
    }

    if (password !== confirmPassword) {
      console.warn('⚠️  [SIGNUP] Passwords do not match');
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      console.warn('⚠️  [SIGNUP] Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    console.log('🔍 [SIGNUP] Checking if email exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('⚠️  [SIGNUP] Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }
    console.log('✓ [SIGNUP] Email is new');

    // Create user
    console.log('👤 [SIGNUP] Creating new user...');
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });

    // Generate and save OTP
    console.log('🔐 [SIGNUP] Generating OTP...');
    const otp = user.generateOTP();
    console.log('✓ [SIGNUP] OTP generated');

    // Save user
    console.log('💾 [SIGNUP] Saving user to database...');
    await user.save();
    console.log('✓ [SIGNUP] User saved. ID:', user._id);

    // Send OTP email
    console.log('📧 [SIGNUP] Attempting to send OTP email...');
    try {
      await sendOTPEmail(email, otp);
      console.log('✓ [SIGNUP] OTP email sent successfully');
    } catch (emailError) {
      console.error('❌ [SIGNUP] Email sending failed:', emailError.message);
      
      // Delete user if email fails
      await User.deleteOne({ _id: user._id });
      console.log('🗑️  [SIGNUP] User deleted due to email failure');
      
      return res.status(500).json({ 
        message: emailError.message,
        hint: 'Please verify your email configuration in .env file. For Gmail, use an App Password from https://myaccount.google.com/apppasswords'
      });
    }

    console.log('✅ [SIGNUP] Signup process completed successfully');
    res.status(201).json({
      message: 'Signup successful! OTP sent to your email.',
      data: {
        userId: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('\n❌ [SIGNUP] FATAL ERROR ============');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('=====================================\n');
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists'
      });
    }

    res.status(500).json({ 
      message: 'Signup failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    console.log('\n🔐 [VERIFY OTP] New verification request');
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    console.log('🔍 [VERIFY OTP] Looking for user:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.warn('⚠️  [VERIFY OTP] User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🔐 [VERIFY OTP] Verifying OTP...');
    if (!user.verifyOTP(otp)) {
      console.warn('⚠️  [VERIFY OTP] Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('✓ [VERIFY OTP] OTP verified successfully');
    user.isEmailVerified = true;
    user.otp = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log('✅ [VERIFY OTP] Verification complete');

    res.status(200).json({
      message: 'Email verified successfully!',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('❌ [VERIFY OTP] Error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('\n🔑 [LOGIN] New login request');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.warn('⚠️  [LOGIN] User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      console.warn('⚠️  [LOGIN] Email not verified');
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      console.warn('⚠️  [LOGIN] Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    console.log('✅ [LOGIN] Login successful');

    res.status(200).json({
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('❌ [LOGIN] Error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    console.log('\n🔄 [RESEND OTP] New resend request');
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const otp = user.generateOTP();
    await user.save();

    try {
      await sendOTPEmail(email, otp);
      console.log('✅ [RESEND OTP] OTP resent successfully');
    } catch (emailError) {
      return res.status(500).json({ 
        message: emailError.message,
        hint: 'Please verify your email configuration'
      });
    }

    res.status(200).json({ message: 'OTP resent to your email' });
  } catch (error) {
    console.error('❌ [RESEND OTP] Error:', error.message);
    res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    console.log('\n🔐 [FORGOT-PASSWORD] ============ PASSWORD RESET OTP REQUEST ============');
    console.log('🔐 [FORGOT-PASSWORD] Email:', req.body.email);
    
    const { email } = req.body;

    if (!email) {
      console.warn('⚠️  [FORGOT-PASSWORD] Email not provided');
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    console.log('🔍 [FORGOT-PASSWORD] Looking for user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.warn('⚠️  [FORGOT-PASSWORD] User not found:', email);
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        message: 'If an account with that email exists, reset OTP will be sent'
      });
    }

    console.log('✓ [FORGOT-PASSWORD] User found');

    // Generate OTP (reusing the same OTP field)
    console.log('🔐 [FORGOT-PASSWORD] Generating reset OTP...');
    const otp = user.generateOTP();
    await user.save();
    console.log('✓ [FORGOT-PASSWORD] Reset OTP generated and saved');

    // Send OTP email
    console.log('📧 [FORGOT-PASSWORD] Sending reset OTP email...');
    try {
      if (!transporter) {
        initializeEmailTransporter();
      }

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested to reset your password. Enter the OTP below to proceed:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #007bff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666;">This OTP is valid for 10 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
      
      console.log('✅ [FORGOT-PASSWORD] Reset OTP email sent successfully');
      
      res.status(200).json({
        message: 'Reset OTP sent to your email'
      });
    } catch (emailError) {
      console.error('❌ [FORGOT-PASSWORD] Email sending failed:', emailError.message);
      user.otp = undefined;
      await user.save();
      return res.status(500).json({ 
        message: 'Failed to send reset OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('❌ [FORGOT-PASSWORD] Error:', error.message);
    res.status(500).json({ message: 'Password reset request failed', error: error.message });
  }
};

// @desc    Verify forgot password OTP
// @route   POST /api/auth/verify-forgot-otp
// @access  Public
export const verifyForgotOTP = async (req, res) => {
  try {
    console.log('\n🔐 [VERIFY FORGOT OTP] New verification request');
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    console.log('🔍 [VERIFY FORGOT OTP] Looking for user:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.warn('⚠️  [VERIFY FORGOT OTP] User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🔐 [VERIFY FORGOT OTP] Verifying OTP...');
    if (!user.verifyOTP(otp)) {
      console.warn('⚠️  [VERIFY FORGOT OTP] Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('✓ [VERIFY FORGOT OTP] OTP verified successfully');
    // Don't clear OTP yet, keep it for password reset verification
    
    res.status(200).json({
      message: 'OTP verified. You can now reset your password.'
    });
  } catch (error) {
    console.error('❌ [VERIFY FORGOT OTP] Error:', error.message);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};

// @desc    Reset password after OTP verification
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    console.log('\n🔓 [RESET-PASSWORD] ============ PASSWORD RESET ATTEMPT ============');
    console.log('🔓 [RESET-PASSWORD] Email:', req.body.email);
    
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      console.warn('⚠️  [RESET-PASSWORD] Missing required fields');
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      console.warn('⚠️  [RESET-PASSWORD] Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find user
    console.log('🔍 [RESET-PASSWORD] Looking for user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.warn('⚠️  [RESET-PASSWORD] User not found');
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('✓ [RESET-PASSWORD] User found');

    // Verify OTP
    console.log('🔐 [RESET-PASSWORD] Verifying OTP...');
    if (!user.verifyOTP(otp)) {
      console.warn('⚠️  [RESET-PASSWORD] Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    console.log('✓ [RESET-PASSWORD] OTP verified');

    // Update password
    console.log('🔐 [RESET-PASSWORD] Updating password...');
    user.password = newPassword;
    user.otp = undefined; // Clear OTP after successful reset
    await user.save();
    console.log('✓ [RESET-PASSWORD] Password updated successfully');

    res.status(200).json({
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('❌ [RESET-PASSWORD] Error:', error.message);
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};