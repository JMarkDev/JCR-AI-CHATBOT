const jwt = require("jsonwebtoken");
require("dotenv").config();
const { setTokens } = require("../helpers/tokenHelpers");

const refreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { accessToken } = setTokens(res, {
        email: decoded.email,
        userRole: decoded.userRole,
      });

      // const accessToken = jwt.sign(
      //   { email: decoded.email },
      //   process.env.ACCESS_TOKEN,
      //   {
      //     expiresIn: "30m",
      //   }
      // );
      // console.log(accessToken, "refresh token function");
      // // Set a secure HTTP-only cookie
      // res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   maxAge: 30 * 60 * 1000, // 30 minutes
      // });

      req.user = decoded;
      // console.log(accessToken);
      // next();
      return res.status(200).json({ accessToken: accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = refreshToken;
