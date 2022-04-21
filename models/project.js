import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: 100,
      required: true,
    },
    preview: {
      type: String,
      lowercase: true,
    },
    github: {
      type: String,
      lowercase: true,
    },
    image: {},
    contact: {},
    phone: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
    },
    creator: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
