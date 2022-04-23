import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { currentUser, otherUser } from "../controllers/user";

router.get("/current-user", requireSignin, currentUser);
router.get("/user/:userId", otherUser);

module.exports = router;
