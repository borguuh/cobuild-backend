import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Project from "../models/project";
import User from "../models/user";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  // console.log(req.body);
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "bucket4lms",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    // upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    // image params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };

    // send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};

export const create = async (req, res) => {
  // console.log("CREATE PROJECT", req.body);
  // return;
  try {
    const alreadyExist = await Project.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist)
      return res.status(400).send("Project title is taken already");

    const project = await new Project({
      slug: slugify(req.body.name),
      creator: req.user._id,
      ...req.body,
    }).save();

    res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Project creation failed. Try again.");
  }
};

export const read = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate("creator", "_id name")
      .exec();
    res.json(project);
  } catch (err) {
    console.log(err);
  }
};

export const projects = async (req, res) => {
  try {
    const all = await Project.find()
      .populate("creator", "_id name")
      .sort({ createdAt: -1 })
      .exec();
    res.json(all);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Getting all projects failed");
  }
};

export const bookmark = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).exec();
    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { projects: project._id },
      },
      { new: true }
    ).exec();
    console.log(result);
    res.json({
      message: "successfully bookmarked",
      project,
    });
  } catch (err) {
    console.log("bookmark error", err);
    return res.status(400).send("bookmark failed");
  }
};
