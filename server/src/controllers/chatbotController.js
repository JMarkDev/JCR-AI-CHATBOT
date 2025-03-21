// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const chatbotPrompt = async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     const result = await model.generateContent(prompt);

//     // Get raw response text
//     const responseText = result.response.text();

//     // Format the response to remove asterisks
//     const formattedResponse = responseText
//       .replace(/\*\*(.*?)\*\*/g, "**$1**") // Keep bold formatting
//       .replace(/[*]\s+/g, "• ") // Replace list asterisks with bullets
//       .replace(/[*]/g, "") // Remove any remaining asterisks
//       .trim(); // Remove extra whitespace

//     res.status(200).json({ response: formattedResponse });
//   } catch (error) {
//     console.error("Error generating content:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   chatbotPrompt,
// };
const ChatHistory = require("../models/chatHistoryModel");
const { OpenAI } = require("openai");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const sequelize = require("../config/database");
const date = require("date-and-time");
const userModel = require("../models/userModel");

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatbotPrompt = async (req, res) => {
  const { userId, sessionId, prompt } = req.body;

  try {
    await ChatHistory.create({
      userId,
      sessionId,
      type: "user",
      text: prompt,
      status: "active",
    });

    // Decrease freeQuestions by 1
    await userModel.increment("freeQuestions", {
      by: -1,
      where: {
        id: userId,
      },
    });
    const result = await model.generateContent(prompt);
    // Get raw response text
    const responseText = result.response.text();

    // Format the response for HTML rendering
    const formattedResponse = responseText
      .replace(/(#+)\s*(.+)/g, (_, hashes, text) => {
        const level = hashes.length; // Determine heading level based on number of #
        return `<h${level}>${text}</h${level}>`;
      }) // Convert markdown headings to HTML
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert bold text
      .replace(/[*]\s+/g, "<li>") // Convert list asterisks to list items
      .replace(/\n/g, "<br>") // Convert newlines to line breaks
      .trim(); // Remove extra whitespace

    // Save bot response to history
    await ChatHistory.create({
      userId,
      sessionId,
      type: "bot",
      status: "active",
      text: formattedResponse,
    });
    res.status(200).json({ response: formattedResponse });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getChatHistory = async (req, res) => {
  const { userId, sessionId } = req.query;

  try {
    const chatHistory = await ChatHistory.findAll({
      where: { userId, sessionId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ chatHistory });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// const generateTitle = (text) => {
//   if (!text || text.length < 3) return "New Chat"; // Ignore very short messages

//   // Common words to remove
//   const stopWords = new Set([
//     "what",
//     "is",
//     "how",
//     "the",
//     "a",
//     "an",
//     "to",
//     "of",
//     "and",
//     "or",
//     "in",
//     "for",
//     "this",
//     "that",
//     "on",
//     "with",
//     "as",
//   ]);

//   const words = text
//     .replace(/[^\w\s]/g, "") // Remove punctuation
//     .split(/\s+/)
//     // .filter((word) => !stopWords.has(word.toLowerCase()))
//     .slice(0, 10); // Keep up to 5 important words

//   return words.length ? words.join(" ") + "..." : "New Chat";
// };

const generateTitle = (text) => {
  if (!text || text.length < 3) return "New Chat"; // Ignore very short messages

  // Remove HTML tags
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "").trim();

  // Common words to remove
  const stopWords = new Set([
    "what",
    "is",
    "how",
    "the",
    "a",
    "an",
    "to",
    "of",
    "and",
    "or",
    "in",
    "for",
    "this",
    "that",
    "on",
    "with",
    "as",
  ]);

  const words = cleanText
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/)
    .slice(0, 15); // Keep up to 10 important words

  return words.length ? words.join(" ") + "..." : "New Chat";
};

const getUserSessions = async (req, res) => {
  const { userId, status } = req.query;

  try {
    // Fetch unique sessions sorted by creation date
    const userSessions = await ChatHistory.findAll({
      where: { userId, status },
      attributes: [
        "sessionId",
        [sequelize.fn("MIN", sequelize.col("createdAt")), "createdAt"],
      ],
      group: ["sessionId"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    // Process each session for a title
    const sessionTitles = new Set(); // To track duplicate titles

    await Promise.all(
      userSessions.map(async (session, index) => {
        let firstMessage = await ChatHistory.findOne({
          where: { sessionId: session.sessionId, type: "bot" },
          attributes: ["text"],
          order: [["createdAt", "ASC"]],
        });

        let title = firstMessage
          ? generateTitle(firstMessage.text)
          : "New Chat";

        // Prevent duplicate titles
        let uniqueTitle = title;
        let count = 1;
        while (sessionTitles.has(uniqueTitle)) {
          uniqueTitle = `${title} (${count++})`; // Append counter if duplicate
        }
        sessionTitles.add(uniqueTitle);

        session.title = uniqueTitle;
      })
    );

    res.status(200).json({ userSessions });
  } catch (error) {
    console.error("Error fetching user sessions:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteSession = async (req, res) => {
  const { userId, sessionId } = req.query;

  try {
    await ChatHistory.destroy({ where: { userId, sessionId } });
    res.status(200).json({ message: "History deleted successfully." });
  } catch (error) {
    console.error("Error deleting session:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const archiveSession = async (req, res) => {
  const { userId, sessionId, status } = req.query;

  try {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time

    await ChatHistory.update(
      {
        status: status,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { userId, sessionId },
      }
    );
    return res.status(200).json({
      message: `Chat history ${status === "archived" ? "Deleted" : "Restored"}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Initialize OpenAI GPT
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Function to generate response using OpenAI
const openAIChatbotPrompt = async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can switch to "gpt-3.5-turbo" if needed
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content.trim();
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Error generating response from OpenAI." });
  }
};

module.exports = {
  chatbotPrompt,
  openAIChatbotPrompt,
  getChatHistory,
  getUserSessions,
  deleteSession,
  archiveSession,
};
