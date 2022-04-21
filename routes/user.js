import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { currentUser, userProjects } from "../controllers/user";

router.get("/current-user", requireSignin, currentUser);
router.get("/user-projects", requireSignin, userProjects);

module.exports = router;
