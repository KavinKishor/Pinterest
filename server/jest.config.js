module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest", // Transform JavaScript files using babel-jest
  },
  testEnvironment: "node", // Optional: Set environment to node for server-side tests
  transformIgnorePatterns: [
    "/node_modules/(?!your-module-to-transform).+\\.js$", // Optional: If you need to transform certain node_modules
  ],
};
