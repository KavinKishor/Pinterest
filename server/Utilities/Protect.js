const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ sucess: false, message: "token not found" });
  }
  try {
    const decode = jwt.verify(token, process.env.TOKEN);
    req.user = decode._id.toString();
    next();
  } catch (error) {
    res.status(401).json({ sucess: false, message: "invalid token" });
  }
};

module.exports = protect;
