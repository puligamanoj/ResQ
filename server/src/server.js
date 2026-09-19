import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚨 [ResQ Backend] Server running on http://localhost:${PORT}`);
    console.log(`⚡ [ResQ Intelligence Engines] Priority Engine, Allocation Engine, Replanning Engine, Risk Engine, and Matching Engine ACTIVE.`);
  });
});
