import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Placeholder API route
app.post("/api/query", (req, res) => {
  const { question } = req.body;

  // Mock response for now
  res.json({
    question,
    data: { message: "Mock result from AI." },
    sql: "SELECT * FROM table WHERE condition;",
    visualizationType: "table"
  });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});
