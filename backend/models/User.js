const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["masteradmin", "admin", "user"],
      default: "user",
    },

    // Track which admin created this user
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Assigned form/module for this user
    assignedForm: {
      type: String,
      default: null,
    },

    // ✅ New: Active/Inactive flag
    isActive: {
      type: Boolean,
      default: true, // By default, new users/admins are active
    },

    // ⭐ Shows when user was Activated or Deactivated
    statusChangedAt: {
      type: Date,
      default: null,
    },

    // ✅ New: Subscription end date
    // subscriptionEnd: {
    //   type: Date,
    //   default: null, // Can be set manually on creation
    // },
  },
  { timestamps: true }
);

// ⚡ Optional: Auto set subscriptionEnd if you want default duration
// userSchema.pre("save", function(next) {
//   if (!this.subscriptionEnd) {
//     const date = new Date();
//     date.setMonth(date.getMonth() + 1); // Default 1 month
//     this.subscriptionEnd = date;
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
