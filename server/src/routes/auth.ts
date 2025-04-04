import express from "express";
import checkBearerToken from "../middlewares/check-bearer-token";
import errorHandler from "../middlewares/error-handler";
import register from "../controllers/auth/register";
import login from "../controllers/auth/login";
import loginWithToken from "../controllers/auth/login-with-token";
import editAccount from "../controllers/auth/edit-account";
import sendVerificationEmail from "../controllers/auth/send-verfication-email";
import verifyEmail from "../controllers/auth/verify-email";
import errorHandlerWithHtml from "../middlewares/error-handler-with-html";
import sendResetPasswordEmail from "../controllers/auth/send-reset-password-email";
import resetPassword from "../controllers/auth/reset-password";
import checkAdminRole from "../controllers/auth/check-admin-role";
import { GetUsers } from "../controllers/auth/get-users";
import { GetUserById } from "../controllers/auth/get-user-by-id";
import multer from "multer";
import editAccountAdmin from "../controllers/auth/edit-account-admin";
import editAccountAvatar from "../controllers/auth/edit-account-avatar";
import editAccountPassword from "../controllers/auth/edit-account-password";
import logOutAllDevices from "../controllers/auth/log-out-add-devices";
import getAllDevices from "../controllers/auth/get-all-devices";
import LogOutSession from "../controllers/auth/log-out-session";
import loginWithDevice from "../controllers/auth/log-in-with-device";
import { deleteUsers } from "../controllers/auth/delete-users";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// initialize router
const router = express.Router();

// POST at route: http://localhost:5000/auth/register
router.post("/register", [], register, errorHandler);

// POST at path: http://localhost:5000/auth/login
router.post("/login", [], login, errorHandler);

// GET at path: http://localhost:5000/auth/login
router.get("/login", [checkBearerToken], loginWithToken, errorHandler);
router.post("/login/device", [checkBearerToken], loginWithDevice, errorHandler);

// POST: http://localhost:5000/auth/logout
router.post("/logout", LogOutSession, errorHandler);

// PUT: update account
router.put("/account", [checkBearerToken, editAccount], errorHandler);
router.put(
  "/account/avatar",
  [upload.single("avatar"), checkBearerToken, editAccountAvatar],
  errorHandler
);

router.put(
  "/account/password",
  [checkBearerToken, editAccountPassword],
  errorHandler
);

router.delete(
  "/account/devices",
  [checkBearerToken, logOutAllDevices],
  errorHandler
);

router.get("/account/devices", [checkBearerToken, getAllDevices], errorHandler);

// POST at route: http://localhost:5000/auth/verify
router.post("/verify", [checkBearerToken, sendVerificationEmail], errorHandler);

// GET at route: http://localhost:5000/auth/verify?token=xyz
router.get("/verify", verifyEmail, errorHandlerWithHtml);

// POST: send account verification reset url link with jwt
router.post("/send-reset-link", sendResetPasswordEmail, errorHandler);

// POST: reset password with jwt
router.post("/reset-password", [checkBearerToken, resetPassword], errorHandler);

// ADMIN ONLY

// GET: get users paginated
router.get(
  "/admin",
  [checkBearerToken, checkAdminRole, GetUsers],
  errorHandler
);

// PUT: update account
router.put(
  "/admin/:uid",
  [upload.single("avatar"), checkBearerToken, checkAdminRole, editAccountAdmin],
  errorHandler
);

// GET: get user by their id
router.get(
  "/admin/:uid",
  [checkBearerToken, checkAdminRole, GetUserById],
  errorHandler
);

router.delete("/account", [checkBearerToken, checkAdminRole, deleteUsers]);

export default router;
