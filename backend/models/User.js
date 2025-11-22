// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   name: { type: String },
//   profession: { type: String },
//   professionDetails: { type: String }, // Company name, college, etc.
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
//   availabilityComment: { type: String, maxlength: 150, default: "" },
//   availabilityCommentUpdatedAt: { type: Date },
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
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  profession: { type: String },
  professionDetails: { type: String }, // Company name, college, etc.

  // Tea Buddy fields
  interest: { type: String }, // For tea buddy conversations

  // Food Buddy fields
  foodPreference: {
    type: String,
    enum: ["Veg", "Non-Veg", "Both"],
    default: null,
  },
  foodMode: {
    type: String,
    enum: ["Restaurant", "Online", "Both"],
    default: null,
  },
  cuisine: { type: String }, // Optional: preferred cuisine

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
  availableForFood: { type: Boolean, default: false },
  availabilityComment: { type: String, maxlength: 150, default: "" },
  availabilityCommentUpdatedAt: { type: Date },
  lastActive: { type: Date, default: Date.now },

  // Profile completion
  profileCompleted: { type: Boolean, default: false },
  foodProfileCompleted: { type: Boolean, default: false },

  // For password reset
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

// Create geospatial index for location-based queries
userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
