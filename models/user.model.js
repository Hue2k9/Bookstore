const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const jwt = require('jsonwebtoken');
const vars = require('./../config/vars');
const crypto = require('crypto');
const { stringify } = require('querystring');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      match: [/^(^\+251|^251|^0)?9\d{8}$/, 'Please add a valid phone number'],
    },
    avatar: {
      type: String,
      default: 'default-avatar.jpg',
    },
    authGoogleId: {
      type: String,
      default: null,
    },
    authFacebookId: {
      type: String,
      default: null,
    },
    authType: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    verifyEmail: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
    },
    emailExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.signToken = function () {
  const payload = { id: this._id };
  const signOptions = {
    expiresIn: vars.jwtExpirationIn,
  };
  return jwt.sign(payload, vars.jwtSecret, signOptions);
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  try {
    if (this.authType !== 'local') next();
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
      next();
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
