// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://omar:_Oar_123@mern.uv25n.mongodb.net/?retryWrites=true&w=majority&appName=Mern&tls=true",);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default connectDB;
