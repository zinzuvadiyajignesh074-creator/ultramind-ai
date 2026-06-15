import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const chats = {};

// ---------- GEMINI API ----------
async function askGemini(prompt) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

// ---------- CHAT API ----------
app.post("/api/chat", async (req, res) => {
  const { user, message } = req.body;

  if (!chats[user]) chats[user] = [];

  const reply = await askGemini(message);

  chats[user].push({ role: "user", text: message });
  chats[user].push({ role: "ai", text: reply });

  res.json({ reply });
});

// ---------- HISTORY ----------
app.post("/api/history", (req, res) => {
  const { user } = req.body;
  res.json({ history: chats[user] || [] });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("UltraMind AI running on port " + PORT));
