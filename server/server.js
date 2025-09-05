import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; // Import multer
import chat from "./chat.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//load .env file into process.env
dotenv.config();

// express(): a .js framework that allows run .js code in Node.js environment
// cors(): // Enables cross-origin requests by specifying allowed domains and methods
//By default, web browsers enforce the same-origin policy, which means that a web page can only make requests to the same domain it was loaded from.
//CORS relaxes this restriction by allowing servers to specify who can access their resources and how.
const app = express();
app.use(cors());


// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to use absolute path for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const PORT = 5001;

let filePath;

//2 APIs used
app.post("/upload", upload.single("file"), async (req, res) => {
  // Use multer to handle file upload
  filePath = req.file.path; // The path where the file is temporarily saved
  res.send(filePath + " upload successfully.");
});

app.get("/chat", async (req, res) => {
  const resp = await chat(filePath, req.query.question); // Pass the file path to your main function
  res.send(resp.text);
});

// Run the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
