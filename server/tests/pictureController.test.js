const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const Picture = require("../Models/PictureModel");
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config()

let token, pictureId;
let server;

beforeAll(async () => {
  const port = process.env.PORT || 5000;

  // Start the server before tests
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Connect to the test database
  await mongoose
    .connect(process.env.MONGO_URL_TEST)
    .then(() => console.log("DB connected"))
    .catch(() => console.log("DB Failed to Connect"));

  // Register a new test user (if registration is required)
  await request(app).post("/user/register").send({
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  });

  // Log in and retrieve token
  const response = await request(app).post("/user/login").send({
    email: "testuser@example.com",
    password: "password123",
  });
  token = response.body.token;

  // Upload a new image to get a pictureId for further testing
  try {
    const imageUploadResponse = await request(app)
      .post("/picture/newimage")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", path.join(__dirname, "testfiles", "test-image.jpg"))
      .field("caption", "Test Image")
      .field("tags", "test,example");

    expect(imageUploadResponse.status).toBe(200);
    pictureId = imageUploadResponse.body.picture._id;
  } catch (error) {
    console.error("Error during image upload test:", error);
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await Picture.deleteMany({});
  await mongoose.connection.close();
  server.close(); // Properly close the server
});

describe("Picture upload tests", () => {
  test("should upload an image", async () => {
    const response = await request(app)
      .post("/picture/newimage")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", path.join(__dirname, "testfiles", "test-image.jpg"))
      .field("caption", "Test Image")
      .field("tags", "test,example");

    expect(response.status).toBe(200);
    expect(response.body.picture).toBeDefined();
  });
});
// describe("Picture API Tests", () => {
//   it("should like a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/likepicture/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`);
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("message", "You liked this image");

//     const picture = await Picture.findById(pictureId);
//     expect(picture.likes).toBeGreaterThan(0);
//   });

//   it("should unlike a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/likepicture/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("message", "you unliked");
//     const picture = await Picture.findById(pictureId);
//     expect(picture.likes).toBeLessThan(1);
//   });

//   it("should tag a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/tagging/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ tag: "newtag" });
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty(
//       "message",
//       "You have successfull tagged this picture"
//     );
//     expect(res.body.picture.tags).toContain("newtag");
//      const picture = await Picture.findById(pictureId);
//      expect(picture.tags).toContain("newtag");
//   });

//   it("should follow a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/following/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("message", "Followed the picture");
//   });

//   it("should unfollow a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/following/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("message", "Unfollowed the picture");
//   });

//   it("should fetch all pictures", async () => {
//     const res = await request(app)
//       .get("/picture/allpictures")
//       .set("Authorization", `Bearer ${token}`);
//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("message", "success");
//     expect(res.body.pictures.length).toBeGreaterThan(0);
//   });

//   it("should delete a tag from a picture", async () => {
//     const res = await request(app)
//       .post(`/picture/deletetag/${pictureId}`)
//       .set("Authorization", `Bearer ${token}`)
//       .send({ tag: "newtag" });
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("message", "Tag deleted successfully");
//   });
// });
