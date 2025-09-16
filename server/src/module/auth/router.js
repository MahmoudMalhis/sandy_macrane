import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  getProfile,
  changePassword,
  checkSetupStatus,
  setupFirstAdmin,
  verifyEmail,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

const setupAdminValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase, uppercase, and number"
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Public routes
router.get("/setup-status", checkSetupStatus);
router.post(
  "/setup-first-admin",
  setupAdminValidation,
  validate,
  setupFirstAdmin
);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.use(authGuard);
router.get("/profile", getProfile);
router.post("/change-password", changePassword);

export default router;
