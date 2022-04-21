import User from "../models/user";

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
