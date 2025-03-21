const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const {
  validateForm,
  updateProfileValidation,
} = require("../middlewares/formValidation");
const otpController = require("../controllers/otpController");

router.get("/get-user", userController.getUserByEmail);
router.put(
  "/update/:id",
  upload.single("image"),
  updateProfileValidation(),
  validateForm,
  userController.updateProfile
);
router.post("/update-email", userController.updateEmail);
router.put("/update-email/verify-otp/:id", otpController.verifyChangeEmail);
router.put("/update-password/:id", userController.updatePassword);
router.put("/paid-subscription", userController.paidSubscription);

module.exports = router;
