const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["parent", "teacher", "admin"],
      default: "parent",
    },
    profile: {
      avatar: {
        type: String,
        default: "default-avatar.png",
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    teacherDetails: {
      subjects: [String],
      grades: [String],
      department: String,
      qualification: String,
    },
    preferences: {
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      language: {
        type: String,
        default: "en",
      },
      theme: {
        type: String,
        default: "light",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
userSchema.methods = {
  // Compare password
  comparePassword: async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  // Generate password reset token
  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return resetToken;
  },

  // Update last login
  updateLastLogin: function () {
    this.lastLogin = new Date();
    return this.save();
  },

  // Add child to parent account
  addChild: function (childId) {
    if (!this.children.includes(childId)) {
      this.children.push(childId);
    }
    return this.save();
  },
};

// Static methods
userSchema.statics = {
  // Find by email
  findByEmail: function (email) {
    return this.findOne({ email: email.toLowerCase() });
  },

  // Get active teachers
  getActiveTeachers: function () {
    return this.find({
      role: "teacher",
      status: "active",
    }).select("-password");
  },

  // Get parents with children
  getParentsWithChildren: function () {
    return this.find({
      role: "parent",
      children: { $exists: true, $not: { $size: 0 } },
    }).populate("children");
  },
};

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.name}`;
});

// Virtual for account age
userSchema.virtual("accountAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included in JSON output
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
