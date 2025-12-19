import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      code: String,
      expiresAt: Date
    },
    resetToken: {
      type: String,
      default: null
    },
    resetTokenExpiry: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
  };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function (enteredOTP) {
  if (!this.otp || !this.otp.code) {
    return false;
  }

  if (new Date() > this.otp.expiresAt) {
    return false; // OTP expired
  }

  return this.otp.code === enteredOTP;
};

// Method to generate reset token
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // Token expires in 30 minutes
  return resetToken;
};

// Method to verify reset token
userSchema.methods.verifyResetToken = function (token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  if (this.resetToken !== hashedToken) {
    return false;
  }
  
  if (new Date() > this.resetTokenExpiry) {
    return false; // Token expired
  }
  
  return true;
};

// Method to clear reset token
userSchema.methods.clearResetToken = function () {
  this.resetToken = null;
  this.resetTokenExpiry = null;
};

const User = mongoose.model('User', userSchema);

export default User;
