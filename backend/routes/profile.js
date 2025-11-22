// import express from "express";
// import {
//   saveProfile,
//   getProfile,
//   toggleAvailability,
//   updateLocation,
//   updateAvailabilityComment,
// } from "../controllers/profileController.js";

// const router = express.Router();

// router.post("/save", saveProfile);
// router.get("/me", getProfile);
// //router.put("/update-phone", updatePhone);
// router.put("/toggle-availability", toggleAvailability);
// router.put("/update-location", updateLocation);
// router.put("/update-comment", updateAvailabilityComment);

// export default router;
import express from "express";
import {
  saveProfile,
  saveFoodProfile,
  getProfile,
  toggleAvailability,
  toggleFoodAvailability,
  updateLocation,
  updateAvailabilityComment,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/save", saveProfile);
router.post("/save-food", saveFoodProfile);
router.get("/me", getProfile);
router.put("/toggle-availability", toggleAvailability);
router.put("/toggle-food-availability", toggleFoodAvailability);
router.put("/update-location", updateLocation);
router.put("/update-comment", updateAvailabilityComment);

export default router;
