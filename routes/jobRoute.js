import express from "express";
import { deleteMyJob, getAllJobs, getJobDetails, getMyAllJobs, getMyJobs, postJob, updateMyJob } from "../controllers/jobController.js";
import isAutherized from "../middlewares/auth.js";
const router = express.Router();

router.route("/postJob").post(isAutherized, postJob);
router.route("/getAllJobs").get(isAutherized,getAllJobs);
router.route("/getMyJobs").get(isAutherized, getMyJobs);
router.route("/deleteJob/:id").delete(isAutherized, deleteMyJob);
router.route("/updateJob/:id").put(isAutherized, updateMyJob)
router.route("/getJobDetails/:id").get(isAutherized, getJobDetails)
router.route("/getMyAllJobs").get(isAutherized, getMyAllJobs)

export default router;