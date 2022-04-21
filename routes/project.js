import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import { uploadImage, removeImage, create, read } from "../controllers/project";

// image
router.post("/project/upload-image", uploadImage);
router.post("/project/remove-image", removeImage);
// project
router.post("/project", requireSignin, create);
router.get("/project/:slug", read); //read specific project

module.exports = router;
