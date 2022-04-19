import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, username, email, password } = req.body;

    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!username) return res.status(400).send("Username is required");
    if (!email) return res.status(400).send("Email is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be at least 6 characters long");
    }

    // user exist or taken?
    let emailExist = await User.findOne({ email }).exec();
    if (emailExist) return res.status(400).send("Email already exists");
    let usernameExist = await User.findOne({ username }).exec();
    if (usernameExist) return res.status(400).send("Username already exists");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};
