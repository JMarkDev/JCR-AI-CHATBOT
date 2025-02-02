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
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatbotPrompt = async (req, res) => {
  const { prompt } = req.body;

  try {
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

    res.status(200).json({ response: formattedResponse });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  chatbotPrompt,
};
