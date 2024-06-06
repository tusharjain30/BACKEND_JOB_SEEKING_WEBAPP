import express from "express"
import { getUser, login, logout, register } from "../controllers/userController.js";
import isAutherized from "../middlewares/auth.js";
const router = express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(isAutherized, logout)
router.route("/getUser").get(isAutherized, getUser)

export default router;