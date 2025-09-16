import { Router } from "express";
import { body } from "express-validator";
import {
  getPublic,
  getAll,
  getByKey,
  set,
  setMultiple,
  deleteSetting, // تم تغيير هذا السطر
  updateWhatsApp,
  updateSocialLinks,
  updateSiteMeta,
  updateHomeSlider,
} from "./controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { validate } from "../../middlewares/validate.js";

const router = Router();

// WhatsApp validation
const whatsappValidation = [
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Invalid phone number format")
    .isLength({ max: 20 })
    .withMessage("Phone number must not exceed 20 characters"),
];

// Social links validation
const socialLinksValidation = [
  body("instagram")
    .optional()
    .isURL()
    .withMessage("Instagram must be a valid URL"),
  body("facebook")
    .optional()
    .isURL()
    .withMessage("Facebook must be a valid URL"),
  body("whatsapp")
    .optional()
    .isURL()
    .withMessage("WhatsApp must be a valid URL"),
];

// Site metadata validation
const siteMetaValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must not exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must not exceed 200 characters"),
  body("keywords")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Keywords must not exceed 200 characters"),
  body("logo").optional().trim(),
];

// Home slider validation
const homeSliderValidation = [
  body("macrame.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Macrame title must not exceed 100 characters"),
  body("macrame.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Macrame subtitle must not exceed 200 characters"),
  body("macrame.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Macrame button text must not exceed 50 characters"),
  body("macrame.image").optional().trim(),
  body("frames.title")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Frames title must not exceed 100 characters"),
  body("frames.subtitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Frames subtitle must not exceed 200 characters"),
  body("frames.button_text")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Frames button text must not exceed 50 characters"),
  body("frames.image").optional().trim(),
];

// Setting value validation
const settingValidation = [
  body("value").notEmpty().withMessage("Value is required"),
];

// Public routes
router.get("/public", getPublic);

// Admin routes
router.use("/admin", authGuard);

router.get("/admin", getAll);
router.get("/admin/:key", getByKey);
router.put("/admin/:key", settingValidation, validate, set);
router.put("/admin", setMultiple);
router.delete("/admin/:key", deleteSetting); // تم تغيير هذا السطر

// Specific setting routes
router.put(
  "/admin/whatsapp/owner",
  whatsappValidation,
  validate,
  updateWhatsApp
);
router.put(
  "/admin/social/links",
  socialLinksValidation,
  validate,
  updateSocialLinks
);
router.put("/admin/site/meta", siteMetaValidation, validate, updateSiteMeta);
router.put(
  "/admin/home/slider",
  homeSliderValidation,
  validate,
  updateHomeSlider
);

export default router;
