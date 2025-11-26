// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Save/Update profile (Tea Buddy) - NOW SUPPORTS MULTIPLE INTERESTS
// export const saveProfile = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { name, profession, professionDetails, interests } = req.body;

//     // Support both single interest (backward compatibility) and multiple interests
//     const updateData = {
//       name,
//       profession,
//       professionDetails: professionDetails || "",
//       profileCompleted: true,
//     };

//     // If interests is an array, use it; otherwise convert single interest to array
//     if (Array.isArray(interests)) {
//       updateData.interests = interests;
//       updateData.interest = interests[0]; // Keep first interest for backward compatibility
//     } else if (interests) {
//       updateData.interests = [interests];
//       updateData.interest = interests;
//     }

//     const user = await User.findByIdAndUpdate(decoded.id, updateData, {
//       new: true,
//     });

//     res.json({
//       msg: "Profile updated successfully",
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         profession: user.profession,
//         professionDetails: user.professionDetails,
//         interests: user.interests,
//         interest: user.interest,
//         profileCompleted: user.profileCompleted,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Save/Update food buddy profile
// export const saveFoodProfile = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { foodPreference, foodMode, cuisine } = req.body;

//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       {
//         foodPreference,
//         foodMode,
//         cuisine: cuisine || "",
//         foodProfileCompleted: true,
//       },
//       { new: true }
//     );

//     res.json({
//       msg: "Food profile updated successfully",
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         profession: user.profession,
//         professionDetails: user.professionDetails,
//         foodPreference: user.foodPreference,
//         foodMode: user.foodMode,
//         cuisine: user.cuisine,
//         foodProfileCompleted: user.foodProfileCompleted,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get user profile
// export const getProfile = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Toggle tea availability
// export const toggleAvailability = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { availableForTea } = req.body;

//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       { availableForTea, lastActive: Date.now() },
//       { new: true }
//     ).select("-password");

//     res.json({
//       msg: "Availability updated",
//       availableForTea: user.availableForTea,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Toggle food availability
// export const toggleFoodAvailability = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { availableForFood } = req.body;

//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       { availableForFood, lastActive: Date.now() },
//       { new: true }
//     ).select("-password");

//     res.json({
//       msg: "Food availability updated",
//       availableForFood: user.availableForFood,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Update location
// export const updateLocation = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { longitude, latitude, availabilityComment } = req.body;

//     const updateData = {
//       location: {
//         type: "Point",
//         coordinates: [longitude, latitude],
//       },
//       lastActive: Date.now(),
//     };

//     if (availabilityComment !== undefined) {
//       updateData.availabilityComment = availabilityComment;
//       updateData.availabilityCommentUpdatedAt = Date.now();
//     }

//     const user = await User.findByIdAndUpdate(decoded.id, updateData, {
//       new: true,
//     }).select("-password");

//     res.json({
//       msg: "Location and comment updated",
//       location: user.location,
//       availabilityComment: user.availabilityComment,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Update only availability comment
// export const updateAvailabilityComment = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { availabilityComment } = req.body;

//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       {
//         availabilityComment: availabilityComment || "",
//         availabilityCommentUpdatedAt: Date.now(),
//       },
//       { new: true }
//     ).select("-password");

//     res.json({
//       msg: "Comment updated",
//       availabilityComment: user.availabilityComment,
//       availabilityCommentUpdatedAt: user.availabilityCommentUpdatedAt,
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Save/Update profile (Tea Buddy) - FIXED TO PRESERVE PROFESSIONDETAILS
export const saveProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profession, professionDetails, interests } = req.body;

    // Validation
    if (!name || !profession) {
      return res.status(400).json({ msg: "Name and profession are required" });
    }

    // CRITICAL: Validate professionDetails for non-"Other" professions
    if (profession !== "Other" && !professionDetails) {
      return res.status(400).json({
        msg: `Please provide details about your ${profession.toLowerCase()} profession`,
      });
    }

    const updateData = {
      name: name.trim(),
      profession,
      // CRITICAL: Always save professionDetails, even if empty string for "Other"
      professionDetails: professionDetails ? professionDetails.trim() : "",
      profileCompleted: true,
    };

    // Handle interests (both single and multiple)
    if (Array.isArray(interests) && interests.length > 0) {
      updateData.interests = interests;
      updateData.interest = interests[0]; // Keep first for backward compatibility
    } else if (interests) {
      updateData.interests = [interests];
      updateData.interest = interests;
    }

    console.log("Saving profile with data:", updateData);

    const user = await User.findByIdAndUpdate(decoded.id, updateData, {
      new: true,
      runValidators: true, // Ensure validators run
    }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify the data was actually saved
    console.log("Profile saved successfully:", {
      userId: user._id,
      name: user.name,
      profession: user.profession,
      professionDetails: user.professionDetails,
      interests: user.interests,
    });

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profession: user.profession,
        professionDetails: user.professionDetails,
        interests: user.interests,
        interest: user.interest,
        profileCompleted: user.profileCompleted,
        availableForTea: user.availableForTea,
        availableForFood: user.availableForFood,
        foodPreference: user.foodPreference,
        foodMode: user.foodMode,
        cuisine: user.cuisine,
      },
    });
  } catch (err) {
    console.error("Save profile error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Save/Update food buddy profile
export const saveFoodProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { foodPreference, foodMode, cuisine } = req.body;

    if (!foodPreference || !foodMode) {
      return res
        .status(400)
        .json({ msg: "Food preference and mode are required" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        foodPreference,
        foodMode,
        cuisine: cuisine || "",
        foodProfileCompleted: true,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Food profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profession: user.profession,
        professionDetails: user.professionDetails,
        foodPreference: user.foodPreference,
        foodMode: user.foodMode,
        cuisine: user.cuisine,
        foodProfileCompleted: user.foodProfileCompleted,
      },
    });
  } catch (err) {
    console.error("Save food profile error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Get user profile - ALWAYS return complete data
export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Log for debugging
    console.log("Fetched user profile:", {
      userId: user._id,
      name: user.name,
      profession: user.profession,
      professionDetails: user.professionDetails,
      interests: user.interests,
    });

    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Toggle tea availability
export const toggleAvailability = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { availableForTea } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { availableForTea, lastActive: Date.now() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Availability updated",
      availableForTea: user.availableForTea,
    });
  } catch (err) {
    console.error("Toggle availability error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Toggle food availability
export const toggleFoodAvailability = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { availableForFood } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { availableForFood, lastActive: Date.now() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Food availability updated",
      availableForFood: user.availableForFood,
    });
  } catch (err) {
    console.error("Toggle food availability error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { longitude, latitude, availabilityComment } = req.body;

    const updateData = {
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      lastActive: Date.now(),
    };

    if (availabilityComment !== undefined) {
      updateData.availabilityComment = availabilityComment;
      updateData.availabilityCommentUpdatedAt = Date.now();
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Location and comment updated",
      location: user.location,
      availabilityComment: user.availabilityComment,
    });
  } catch (err) {
    console.error("Update location error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Update only availability comment
export const updateAvailabilityComment = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { availabilityComment } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        availabilityComment: availabilityComment || "",
        availabilityCommentUpdatedAt: Date.now(),
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      msg: "Comment updated",
      availabilityComment: user.availabilityComment,
      availabilityCommentUpdatedAt: user.availabilityCommentUpdatedAt,
    });
  } catch (err) {
    console.error("Update comment error:", err);
    res.status(500).json({ msg: err.message });
  }
};
