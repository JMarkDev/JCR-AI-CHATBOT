const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/prompt", chatbotController.chatbotPrompt);
router.get("/history", chatbotController.getChatHistory);
router.get("/get-by-session", chatbotController.getUserSessions);
router.delete("/delete-session", chatbotController.deleteSession);
router.put("/archive-session", chatbotController.archiveSession);

module.exports = router;
