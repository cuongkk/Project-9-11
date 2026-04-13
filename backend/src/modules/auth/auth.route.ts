import { Router } from "express";
import * as authController from "./auth.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  otpBodySchema,
  refreshBodySchema,
  registerBodySchema,
  resetPasswordBodySchema,
} from "./auth.validation";

const router = Router();

router.get("/login", authController.login);
router.post("/login", validate({ body: loginBodySchema }), authController.loginPost);

router.get("/register", authController.register);
router.post("/register", validate({ body: registerBodySchema }), authController.registerPost);

router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password", validate({ body: forgotPasswordBodySchema }), authController.forgotPasswordPost);

router.get("/otp-password", authController.otpPassword);
router.post("/otp-password", validate({ body: otpBodySchema }), authController.otpPasswordPost);

router.get("/reset-password", authController.resetPassword);
router.post("/reset-password", verifyToken, validate({ body: resetPasswordBodySchema }), authController.resetPasswordPost);

router.get("/me", verifyToken, authController.getMe);

router.get("/logout", authController.logout);

router.post("/refresh", validate({ body: refreshBodySchema }), authController.refreshPost);

export default router;
