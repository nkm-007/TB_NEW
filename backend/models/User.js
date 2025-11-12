// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   phone: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   name: { type: String },
//   profession: { type: String },
//   interest: { type: String },

//   // Location fields for geospatial queries
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point",
//     },
//     coordinates: {
//       type: [Number], // [longitude, latitude]
//       default: [0, 0],
//     },
//   },

//   // Availability status
//   availableForTea: { type: Boolean, default: false },
//   lastActive: { type: Date, default: Date.now },

//   // Profile completion
//   profileCompleted: { type: Boolean, default: false },

//   // For password reset
//   resetOtp: { type: String },
//   resetOtpExpiry: { type: Date },

//   createdAt: { type: Date, default: Date.now },
// });

// // Create geospatial index for location-based queries
// userSchema.index({ location: "2dsphere" });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  profession: { type: String },
  interest: { type: String },

  // Location fields for geospatial queries
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },

  // Availability status
  availableForTea: { type: Boolean, default: false },
  availabilityComment: { type: String, maxlength: 150, default: "" },
  lastActive: { type: Date, default: Date.now },

  // Profile completion
  profileCompleted: { type: Boolean, default: false },

  // For password reset
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

// Create geospatial index for location-based queries
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
