const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRouter = require("./Routers/UserRouter");
const pictureRouter = require("./Routers/PictureRouter");

const app = express();

app.listen(process.env.Port, () => {
  console.log(`Server Port is : ${process.env.Port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(() => console.log("DB not Connected"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/picture", pictureRouter);

module.exports = app; 