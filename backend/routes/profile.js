// import express from "express";
// import {
//   saveProfile,
//   getProfile,
//   updatePhone,
//   toggleAvailability,
//   updateLocation,
// } from "../controllers/profileController.js";

// const router = express.Router();

// router.post("/save", saveProfile);
// router.get("/me", getProfile);
// router.put("/update-phone", updatePhone);
// router.put("/toggle-availability", toggleAvailability);
// router.put("/update-location", updateLocation);

// export default router;
import express from "express";
import {
  saveProfile,
  getProfile,
  toggleAvailability,
  updateLocation,
  updateAvailabilityComment,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/save", saveProfile);
router.get("/me", getProfile);
//router.put("/update-phone", updatePhone);
router.put("/toggle-availability", toggleAvailability);
router.put("/update-location", updateLocation);
router.put("/update-comment", updateAvailabilityComment);

export default router;
