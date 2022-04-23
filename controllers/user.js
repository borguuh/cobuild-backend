import User from "../models/user";
import Project from "../models/project";

export const currentUser = async (req, res) => {
  try {
    //find user with id from verified token
    //log user, exclude password
    const user = await User.findById(req.user._id)
      .select("-password -passwordResetCode")
      .exec();
    console.log("CURRENT_USER", user);
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};

export const otherUser = async (req, res) => {
  try {
    //find user with id from params
    //log user, exclude password
    // userId;
    const user = await User.findById(req.params.userId)
      .select("-password -passwordResetCode")
      .exec();
    console.log("Other USER", user);
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};
