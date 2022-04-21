import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { currentUser } from "../controllers/user";

router.get("/current-user", requireSignin, currentUser);

module.exports = router;
