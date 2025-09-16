import { Router } from "express";
import { body, query } from "express-validator";
import {
  getAll,
  getFeatured,
  create,
  getAllAdmin,
  getStats,
  getById,
  update,
  changeStatus,
  delete as deleteReview,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";
import { formLimiter } from "../../middlewares/rateLimiter.js";
import { upload } from "../../utils/upload.js";

const router = Router();

// Review creation validation
const createReviewValidation = [
  body("author_name")
    .trim()
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ max: 100 })
    .withMessage("Author name must not exceed 100 characters"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Review text is required")
    .isLength({ max: 1000 })
    .withMessage("Review text must not exceed 1000 characters"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
];

// Review update validation
const updateReviewValidation = [
  body("author_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Author name must not exceed 100 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("text")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Review text must not exceed 1000 characters"),
  body("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
  body("status")
    .optional()
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
];

// Status change validation
const statusValidation = [
  body("status")
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
];

// Query validation for filtering
const queryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["pending", "published", "hidden"])
    .withMessage("Status must be pending, published, or hidden"),
  query("linked_album_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Album ID must be a positive integer"),
];

// Public routes
router.get("/", queryValidation, validate, getAll);
router.get("/featured", getFeatured);
router.post(
  "/",
  formLimiter,
  upload.single("review_image"),
  createReviewValidation,
  validate,
  create
);

// Admin routes
router.use("/admin", authGuard);

router.get("/admin", queryValidation, validate, getAllAdmin);
router.get("/admin/stats", getStats);
router.get("/admin/:id", getById);
router.put("/admin/:id", updateReviewValidation, validate, update);
router.put("/admin/:id/status", statusValidation, validate, changeStatus);
router.delete("/admin/:id", deleteReview);

export default router;
