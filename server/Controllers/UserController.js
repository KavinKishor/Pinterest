const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handlr");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let createuser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 7);
  const exisitinguser = await User.findOne({ email });
  if (exisitinguser) {
    return res
      .status(400)
      .json({ success: false, message: "user email already registered" });
  }
  try {
    const user = await new User({ email, name, password: hashed });
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "user created successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Error occured to create new user" });
  }
});

let loguser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
 
  // console.log(email, password);
  // console.log(req.body);

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is not registerd",
      });
    }

    const userPassword = await bcrypt.compare(password, user.password);
    console.log(userPassword);

    if (!userPassword) {
      return res.status(401).json({
        success: false,
        message: "Password you have entered is not correct",
      });
    }
    const userToken = jwt.sign({ _id: user._id }, process.env.TOKEN, {
      expiresIn: "10d",
    });
    // console.log(userToken);
   
    
    return res.status(200).json({
      success: true,
      message: "user logged successfully",
      userToken,
      userEmail: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
});

const viewuser = asyncHandler(async (req, res) => {
  const view = await User.find({});
  res.status(200).json(view);
});
module.exports = { createuser, loguser, viewuser };
