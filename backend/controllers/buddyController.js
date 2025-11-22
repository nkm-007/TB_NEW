// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// // Find nearby buddies within 1km radius
// export const findNearbyBuddies = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const currentUser = await User.findById(decoded.id);

//     if (!currentUser) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const { longitude, latitude, interest } = req.query;

//     if (!longitude || !latitude) {
//       return res.status(400).json({ msg: "Location required" });
//     }

//     if (!interest) {
//       return res.status(400).json({ msg: "Interest required" });
//     }

//     // Find users within 1km (1000 meters) radius
//     const nearbyUsers = await User.find({
//       _id: { $ne: currentUser._id }, // Exclude current user
//       availableForTea: true, // Only available users
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [parseFloat(longitude), parseFloat(latitude)],
//           },
//           $maxDistance: 1000, // 1000 meters = 1km
//         },
//       },
//     })
//       .select(
//         "name profession professionDetails interest location lastActive availabilityComment"
//       )
//       .limit(50); // Limit to 50 results

//     // Separate by interest match based on SELECTED interest, not current user's interest
//     const matchedInterest = nearbyUsers.filter(
//       (user) => user.interest === interest
//     );

//     const otherInterests = nearbyUsers.filter(
//       (user) => user.interest !== interest
//     );

//     res.json({
//       matchedInterest,
//       otherInterests,
//       totalFound: nearbyUsers.length,
//     });
//   } catch (err) {
//     console.error("Find buddies error:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get all available users (for browsing)
// export const getAllAvailableUsers = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const availableUsers = await User.find({
//       _id: { $ne: decoded.id },
//       availableForTea: true,
//       profileCompleted: true,
//     })
//       .select("name profession interest lastActive")
//       .sort({ lastActive: -1 })
//       .limit(100);

//     res.json({ users: availableUsers });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Find nearby tea buddies - NOW SUPPORTS MULTIPLE INTERESTS
export const findNearbyBuddies = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { longitude, latitude, interests } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ msg: "Location required" });
    }

    if (!interests) {
      return res.status(400).json({ msg: "At least one interest required" });
    }

    // Parse interests (can be comma-separated string or array)
    const interestArray =
      typeof interests === "string"
        ? interests.split(",").map((i) => i.trim())
        : Array.isArray(interests)
        ? interests
        : [interests];

    // Find users within 1km
    const nearbyUsers = await User.find({
      _id: { $ne: currentUser._id },
      availableForTea: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 1000,
        },
      },
    })
      .select(
        "name profession professionDetails interests interest location lastActive availabilityComment"
      )
      .limit(50);

    // Separate by interest match
    const matchedInterest = nearbyUsers.filter((user) => {
      // Check if user has any of the selected interests
      const userInterests =
        user.interests && user.interests.length > 0
          ? user.interests
          : user.interest
          ? [user.interest]
          : [];

      return interestArray.some((selectedInterest) =>
        userInterests.includes(selectedInterest)
      );
    });

    const otherInterests = nearbyUsers.filter((user) => {
      const userInterests =
        user.interests && user.interests.length > 0
          ? user.interests
          : user.interest
          ? [user.interest]
          : [];

      return !interestArray.some((selectedInterest) =>
        userInterests.includes(selectedInterest)
      );
    });

    res.json({
      matchedInterest,
      otherInterests,
      totalFound: nearbyUsers.length,
    });
  } catch (err) {
    console.error("Find buddies error:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Find nearby food buddies - FIXED "Both" LOGIC
export const findNearbyFoodBuddies = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { longitude, latitude, foodPreference, foodMode } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ msg: "Location required" });
    }

    if (!foodPreference || !foodMode) {
      return res.status(400).json({ msg: "Food preferences required" });
    }

    const query = {
      _id: { $ne: currentUser._id },
      availableForFood: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 1000,
        },
      },
    };

    // Find all nearby users first
    const nearbyUsers = await User.find(query)
      .select(
        "name profession professionDetails foodPreference foodMode cuisine interests interest location lastActive availabilityComment"
      )
      .limit(50);

    // FIXED: Enhanced matching logic for "Both" option
    const matchedUsers = nearbyUsers.filter((user) => {
      // Food preference matching
      const prefMatches =
        foodPreference === "Both" || // If user selected Both, match with everyone
        user.foodPreference === "Both" || // If buddy has Both, they match
        user.foodPreference === foodPreference; // Direct match

      // Food mode matching
      const modeMatches =
        foodMode === "Both" || // If user selected Both, match with everyone
        user.foodMode === "Both" || // If buddy has Both, they match
        user.foodMode === foodMode; // Direct match

      return prefMatches && modeMatches;
    });

    const otherUsers = nearbyUsers.filter((user) => {
      return !matchedUsers.find(
        (m) => m._id.toString() === user._id.toString()
      );
    });

    res.json({
      matchedUsers,
      otherUsers,
      totalFound: nearbyUsers.length,
    });
  } catch (err) {
    console.error("Find food buddies error:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const getAllAvailableUsers = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const availableUsers = await User.find({
      _id: { $ne: decoded.id },
      availableForTea: true,
      profileCompleted: true,
    })
      .select("name profession interests interest lastActive")
      .sort({ lastActive: -1 })
      .limit(100);

    res.json({ users: availableUsers });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
