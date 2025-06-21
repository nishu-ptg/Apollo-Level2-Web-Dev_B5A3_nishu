import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

async function main() {
  try {
    if (!DB_URL) {
      throw new Error("Missing DB_URL environment variable");
    }

    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
