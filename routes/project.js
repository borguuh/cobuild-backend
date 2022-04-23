import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  projects,
  bookmark,
  unbookmark,
  userProjects,
  otherUser,
} from "../controllers/project";

router.get("/projects", projects);
// image
router.post("/project/upload-image", uploadImage);
router.post("/project/remove-image", removeImage);
// project
router.post("/project", requireSignin, create);
router.get("/project/:slug", read); //read specific project
router.get("/user-projects", requireSignin, userProjects);
router.get("/other-user/:userId", otherUser);
// bookmark
router.post("/bookmark/:projectId", requireSignin, bookmark);
router.post("/unbookmark/:projectId", requireSignin, unbookmark);

module.exports = router;
