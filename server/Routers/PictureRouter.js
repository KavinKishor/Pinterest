const express = require("express");
const protect = require("../Utilities/Protect");
const multer = require("multer");
const path = require("path");
const { newimage, likepicture, tagpicture, followpicture, showallpictures, deletetag } = require("../Controllers/PictureController");

const router = express.Router();

const mydir = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../frontend/src/Images"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: mydir });

router.route("/newimage").post(protect, upload.single("image"), newimage);
router.route("/likepicture/:id").post(protect,likepicture)
router.route("/tagging/:id").post(protect,tagpicture)
router.route("/following/:id").post(protect,followpicture)
router.route("/allpictures").get(protect,showallpictures)
router.route("/deletetag/:id").post(protect,deletetag)
module.exports = router;
