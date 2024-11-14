const Picture = require("../Models/PictureModel");
const asyncHandler = require("express-async-handlr");
const User = require("../Models/UserModel");

const newimage = asyncHandler(async (req, res) => {
  const { caption, tags } = req.body;
  const imageUrl = req.file ? req.file.filename : null;
  try {
    const image = await new Picture({
      imageUrl,
      caption,
      tags,
    });
    await image.save();
    res.status(201).json({ message: "Picture uploaded successfully", image });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ message: "Error occured while uploading image", error });
  }
});

const likepicture = asyncHandler(async (req, res) => {
  const userId = req.user.toString();
  const pictureId = req.params.id;

  try {
    const picture = await Picture.findById(pictureId);

    if (!picture) {
      return res.status(404).json({ message: "No image available" });
    }

    if (!picture.likes.includes(userId)) {
      picture.likes = [userId];
      await picture.save();
      return res
        .status(201)
        .json({ message: "You liked the picture", picture });
    } else {
      picture.likes = [];
      await picture.save();
      return res
        .status(200)
        .json({ message: "You unliked the picture", picture });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error occurred while liking the image", error });
  }
});

const tagpicture = asyncHandler(async (req, res) => {
  const { tag } = req.body;

  try {
    const picture = await Picture.findById(req.params.id);
    if (!picture) return res.json({ message: "No image available" });
    if (!picture.tags.includes(tag)) {
      picture.tags.push(tag);
      await picture.save();
      res
        .status(201)
        .json({ message: "You have successfull tagged this picture", picture });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Error occured while tagging picture" });
  }
});

const followpicture = asyncHandler(async (req, res) => {
  const userId = req.user.toString();

  try {
    const picture = await Picture.findById(req.params.id);
    if (!picture)
      return res.status(404).json({ message: "No image available" });

    const isFollowing = picture.followingUsers.includes(userId);

    if (isFollowing) {
      picture.followingUsers = picture.followingUsers.filter(
        (id) => id.toString() !== userId
      );
      await picture.save();
      res.status(200).json({ message: "Unfollowed the picture", picture });
    } else {
      picture.followingUsers.push(userId);
      await picture.save();
      res.status(200).json({ message: "Followed the picture", picture });
    }
  } catch (error) {
    console.error("Error in followPicture:", error);
    res.status(500).json({ message: "Error occurred", error });
  }
});
const showallpictures = asyncHandler(async (req, res) => {
  const pictures = await Picture.find({});
  if (!pictures) return res.status(201).json({ message: "No image available" });
  res.status(201).json({ message: "success", pictures });
});

const deletetag = asyncHandler(async (req, res) => {
  const { tag } = req.body;

  try {
    const picture = await Picture.findById(req.params.id);
    if (!picture)
      return res.status(201).json({ message: "No image available" });

    if (typeof tag !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid tag format" });
    }
    const tagIndex = picture.tags.indexOf(tag);
    // console.log(tagIndex);
    if (!tagIndex)
      return res.status(401).json({ message: "Tag not available" });

    if (tagIndex === -1) {
      return res.status(400).json({ success: false, message: "Tag not found" });
    }
    picture.tags.splice(tagIndex, 1);
    await picture.save();
    res.status(200).json({ message: "Tag deleted successfully", picture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error });
  }
});
module.exports = {
  newimage,
  likepicture,
  tagpicture,
  followpicture,
  showallpictures,
  deletetag,
};
