import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

module.exports = router;
