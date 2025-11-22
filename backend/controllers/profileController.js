// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Save/Update profile
// export const saveProfile = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { name, profession, professionDetails, interest } = req.body;

//     const user = await User.findByIdAndUpdate(
//       decoded.id,
//       {
//         name,
//         profession,
//         professionDetails: professionDetails || "",
//         interest,
//         profileCompleted: true,
//       },
//       { new: true }
//     );

//     res.json({
//       msg: "Profile updated successfully",
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         profession: user.profession,
//         professionDetails: user.professionDetails,
//         interest: user.interest,
//         profileCompleted: user.profileCompleted,
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

// // Toggle availability
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

// Save/Update profile (Tea Buddy)
export const saveProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, profession, professionDetails, interest } = req.body;

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        profession,
        professionDetails: professionDetails || "",
        interest,
        profileCompleted: true,
      },
      { new: true }
    );

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profession: user.profession,
        professionDetails: user.professionDetails,
        interest: user.interest,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
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

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        foodPreference,
        foodMode,
        cuisine: cuisine || "",
        foodProfileCompleted: true,
      },
      { new: true }
    );

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
    res.status(500).json({ msg: err.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({ user });
  } catch (err) {
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

    res.json({
      msg: "Availability updated",
      availableForTea: user.availableForTea,
    });
  } catch (err) {
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

    res.json({
      msg: "Food availability updated",
      availableForFood: user.availableForFood,
    });
  } catch (err) {
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

    res.json({
      msg: "Location and comment updated",
      location: user.location,
      availabilityComment: user.availabilityComment,
    });
  } catch (err) {
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

    res.json({
      msg: "Comment updated",
      availabilityComment: user.availabilityComment,
      availabilityCommentUpdatedAt: user.availabilityCommentUpdatedAt,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
