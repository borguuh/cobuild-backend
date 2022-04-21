import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { uploadImage, removeImage } from "../controllers/project";

// image
router.post("/project/upload-image", uploadImage);
router.post("/project/remove-image", removeImage);

module.exports = router;
