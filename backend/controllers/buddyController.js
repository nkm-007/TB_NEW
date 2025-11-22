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

// Find nearby tea buddies within 1km radius
export const findNearbyBuddies = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { longitude, latitude, interest } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ msg: "Location required" });
    }

    if (!interest) {
      return res.status(400).json({ msg: "Interest required" });
    }

    // Find users within 1km (1000 meters) radius
    const nearbyUsers = await User.find({
      _id: { $ne: currentUser._id }, // Exclude current user
      availableForTea: true, // Only available users
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 1000, // 1000 meters = 1km
        },
      },
    })
      .select(
        "name profession professionDetails interest location lastActive availabilityComment"
      )
      .limit(50); // Limit to 50 results

    // Separate by interest match based on SELECTED interest, not current user's interest
    const matchedInterest = nearbyUsers.filter(
      (user) => user.interest === interest
    );

    const otherInterests = nearbyUsers.filter(
      (user) => user.interest !== interest
    );

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

// Find nearby food buddies within 1km radius
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

    // Build query for food buddies
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
        "name profession professionDetails foodPreference foodMode cuisine location lastActive availabilityComment"
      )
      .limit(50);

    // Filter for matched preferences
    const matchedUsers = nearbyUsers.filter((user) => {
      // Food preference matching
      const prefMatches =
        foodPreference === "Both" ||
        user.foodPreference === "Both" ||
        user.foodPreference === foodPreference;

      // Food mode matching
      const modeMatches =
        foodMode === "Both" ||
        user.foodMode === "Both" ||
        user.foodMode === foodMode;

      return prefMatches && modeMatches;
    });

    // Rest are "other" buddies
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

// Get all available users (for browsing)
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
      .select("name profession interest lastActive")
      .sort({ lastActive: -1 })
      .limit(100);

    res.json({ users: availableUsers });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
