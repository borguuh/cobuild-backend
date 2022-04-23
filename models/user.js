import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    bio: {
      type: String,
    },
    title: {
      type: String,
    },
    twitter: {
      type: String,
    },
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    image: {},
    role: {
      type: [String],
      default: ["Member"],
      enum: ["Member", "Admin"],
    },
    passwordResetCode: {
      data: String,
      default: "",
    },
    bookmarks: [{ type: ObjectId, ref: "Project" }],
    projects: [{ type: ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
