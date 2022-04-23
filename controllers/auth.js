import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";

import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

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

    // exclude unnecessary details from data to send
    user.password = undefined;
    user.bookmarks = undefined;
    user.projects = undefined;
    user.role = undefined;
    user.passwordResetCode = undefined;

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

// export const currentUser = async (req, res) => {
//   try {
//     //find user with id from verified token
//     //log user, exclude password
//     const user = await User.findById(req.user._id).select("-password").exec();
//     console.log("CURRENT_USER", user);
//     return res.json({ ok: true });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    // email parameters and content
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>Please, use this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <p> Kindly ignore if you didn't request password reset</p>
                  <i>Cobuild ©2022</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    if (!user) return res.status(400).send("Error! Try again.");
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
