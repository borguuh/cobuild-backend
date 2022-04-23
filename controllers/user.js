import User from "../models/user";
import Project from "../models/project";

export const currentUser = async (req, res) => {
  try {
    //find user with id from verified token
    //log user, exclude password
    const user = await User.findById(req.user._id)
      .select("-password -passwordResetCode -role -bookmarks -projects")
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
      .select("-password -passwordResetCode -role -bookmarks -projects")
      .exec();
    console.log("Other USER", user);
    return res.send(user);
  } catch (err) {
    console.log(err);
  }
};

// export const update = async (req, res) => {
//   try {
//     // console.log("UPDATE Project", req.body);
//     const { userId } = req.params;
//     const {
//       _id,
//       name,
//       email,
//       username,
//       image,
//       bio,
//       title,
//       linkedin,
//       github,
//       twitter,
//     } = req.body;
//     const user = await User.findById(userId).exec();

//     if (user._id != req.user._id) {
//       return res.status(400).send("Unauthorized");
//     }

//     const updated = await Project.updateOne(
//       { "user._id": _id },
//       {
//         $set: {
//           "user.$.name": name,
//           "user.$.email": email,
//           "user.$.username": username,
//           "user.$.bio": bio,
//           "user.$.image": image,
//           "user.$.title": title,
//           "user.$.twitter": twitter,
//           "user.$.github": github,
//           "user.$.linkedin": linkedin,
//         },
//       },
//       { new: true }
//     ).exec();
//     // console.log("updated", updated);
//     res.json({ ok: true });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send("Profile update failed");
//   }
// };

export const update = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(slug);
    const user = await User.findById(userId).exec();
    // console.log("Project FOUND => ", project);

    if (user._id != req.user._id) {
      return res.status(400).send("Unauthorized");
    }

    const update = await User.findOneAndUpdate(userId, req.body, {
      new: true,
    }).exec();

    const updated = await User.findById(userId)
      .select("-password -passwordResetCode -role -bookmarks -projects")
      .exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};
