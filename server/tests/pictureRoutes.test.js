const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const mongoose = require("mongoose");
require("dotenv").config();

let token;
let server;

// Setup a test user and generate token before running tests
beforeAll(async () => {
  // Connect to the database (if not already connected)
  const MONGO_URI =
    "mongodb+srv://kaviaero23997:Kavinkl%405@cluster0.3ael2.mongodb.net/pinterest?retryWrites=true&w=majority&appName=Cluster0";
   if (MONGO_URI) {
     try {
      await mongoose.connect(MONGO_URI);
       console.log("DB Connected");
     } catch (error) {
       console.error("Database connection failed", error);
       process.exit(1); // Exit the process if DB connection fails
     }
   }

  // Create a test user
  const testUser = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "password",
  });

  console.log(testUser);
  
  // Generate JWT token for the test user
  token = jwt.sign({ id: testUser._id }, process.env.TOKEN, {
    expiresIn: "2h",
  });
console.log(token);

  // Start the server and save the instance
  server = app.listen(process.env.Port || 5000, () => {
    console.log(`Server running on port ${process.env.Port || 5000}`);
  });
}, 10000); // Increased timeout to 10 seconds for setup

// Test the GET /picture endpoint with authentication
describe("GET /picture", () => {
  it("should return a list of pictures", async () => {
    const response = await request(app)
      .get("/picture/allpictures")
      .set("Authorization", `Bearer ${token}`); // Include token in Authorization header
console.log(response);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("pictures");
  });
});

afterAll(async () => {
  await User.deleteMany({}); // Cleanup the test user
  await mongoose.connection.close(); // Close the database connection
  if (server) {
    server.close(); // Close the server to avoid open handle
  }
}, 10000); 