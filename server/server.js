const express = require("express");
const database = require("./src/config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const verifyToken = require("./src/middlewares/verifyToken");
const refreshToken = require("./src/middlewares/refreshToken");
const authRoute = require("./src/routes/authRoute");
const app = express();
const PORT = process.env.PORT || 5000;
const chatbotRoute = require("./src/routes/chatbotRoute");
const userRoute = require("./src/routes/userRoute");

const corsOptions = {
  origin: ["http://localhost:5173"],
  // origin: ["http://192.168.1.8:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
// built in middleware the handle urlencoded data
// in other words form data;
// 'content-type: application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// public routes no token required

app.use("/auth", authRoute);
// refresh token route
app.post("/refresh", refreshToken, async (req, res) => {
  return res.json({ message: "refresh" });
});

//protected route
app.use("/protected", verifyToken, async (req, res) => {
  return res.json({
    user: req.user,
    message: "You are authorized to access this protected resources.",
  });
});

// check verify user middleware
app.use(verifyToken);

app.get("/");

app.use("/chatbot", chatbotRoute);
app.use("/users", userRoute);

// Server setup
const server = http.createServer(app);

// if (process.env.DEVELOPMENT !== "test") {
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  database.authenticate();
  database
    .sync({ force: false }) // delelte all data in the database
    // .sync({ alter: true })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Error connecting to the database: ", error);
    });
});
// }

module.exports = app;
// add seeders and use id that already exit in database when it have foreignkey
