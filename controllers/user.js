import User from "../models/user";
import Project from "../models/project";

export const currentUser = async (req, res) => {
  try {
    //find user with id from verified token
    //log user, exclude password
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const userProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(projects);
  } catch (err) {
    console.log(err);
  }
};
