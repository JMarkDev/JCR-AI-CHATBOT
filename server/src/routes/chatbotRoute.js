const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/prompt", chatbotController.chatbotPrompt);

module.exports = router;
