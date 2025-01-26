const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    // const token = req.cookies.accessToken;
    // console.log(token, "access token");
    // if (!token) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.json({ message: "Unauthorized" });
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.json({ error: "Unauthorized" });
      }

      req.user = decoded;
      // console.log(decoded);
      next();
    });
    // return res.json(token);
  } catch (error) {
    // console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = verifyToken;
