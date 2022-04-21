import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { uploadImage } from "../controllers/project";

// image
router.post("/project/upload-image", uploadImage);

module.exports = router;
