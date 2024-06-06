import express from "express"
import isAutherized from "../middlewares/auth.js";
import { createApplication, deleteMyApplication, getAllApplications, getMyApplication } from "../controllers/applicationController.js";
const router = express.Router()

router.route("/createApplication").post(isAutherized, createApplication)
router.route("/getMyApplications").get(isAutherized, getMyApplication)
router.route("/deleteMyApplications/:id").delete(isAutherized, deleteMyApplication)
router.route("/getAllApplications").get(isAutherized, getAllApplications)

export default router;