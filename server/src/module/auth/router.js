import { Router } from "express";
import { body } from "express-validator";
import { login, getProfile, createAdmin, changePassword } from "./controller";
import { authGuard } from "../../middlewares/authGuard";
import { validate } from "../../middlewares/validate";

const router = Router();

// Login validation rules
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Create admin validation rules
const createAdminValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["owner", "editor"])
    .withMessage("Role must be either owner or editor"),
];

// Change password validation rules
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Public routes
router.post("/login", loginValidation, validate, login);

// Protected routes
router.use(authGuard); // All routes below require authentication

router.get("/profile", getProfile);
router.post(
  "/create-admin",
  createAdminValidation,
  validate,
  createAdmin
);
router.post(
  "/change-password",
  changePasswordValidation,
  validate,
  changePassword
);

export default router;
