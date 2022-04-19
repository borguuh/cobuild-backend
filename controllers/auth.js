import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;

    // check if user exists with the email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("invalid username or password");

    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("invalid username or password");

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // exclude hashed password from data to send
    user.password = undefined;

    // send token in cookie to client
    res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true, // only works on https
    });

    // return user as json response to client
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout successful" });
  } catch (err) {
    console.log(err);
  }
};
