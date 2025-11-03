

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import qs from "qs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

// ---------- Middleware ----------
app.use(express.json());
app.use(cors({ 
  origin: ["https://graphizine-frontend.onrender.com", "https://accounts.google.com"], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/uploads", express.static("uploads"));

// ---------- Server & DB ----------
const PORT = process.env.PORT || 8080;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("✅ Database Connected Successfully.");
    // app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ---------------- Category Schema ----------------
const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, trim: true },
});
const CategoryModel = mongoose.model("Category", CategorySchema);

// ---------------- Image Schema ----------------
const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    category: { type: String, required: true },
    imagePath: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt & updatedAt
);
const ImageModel = mongoose.model("Image", ImageSchema);

// ---------------- Admin Login Route ----------------
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.json({ token });
});

// Middleware to protect admin routes
export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// ---------------- Category Routes ----------------
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }
  try {
    const existing = await CategoryModel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(200).json({ message: "Category already exists" });
    }
    const newCategory = new CategoryModel({ name: name.trim() });
    await newCategory.save();
    res.json({ success: true, category: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating category");
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching categories");
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await CategoryModel.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const imagesToDelete = await ImageModel.find({ category: category.name });

    imagesToDelete.forEach((img) => {
      try {
        if (fs.existsSync(img.imagePath)) fs.unlinkSync(img.imagePath);
      } catch {
        console.warn(`⚠️ Could not delete file: ${img.imagePath}`);
      }
    });

    await ImageModel.deleteMany({ category: category.name });
    await CategoryModel.findByIdAndDelete(id);

    res.status(200).json({ message: `Category '${category.name}' deleted successfully` });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------- Multer Config ----------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ---------------- Image Routes ----------------
app.post("/api/upload", authenticateAdmin, upload.single("image"), async (req, res) => {
  const { name, category } = req.body;
  if (!category?.trim()) {
    return res.status(400).json({ error: "Category is required" });
  }
  try {
    let cat = await CategoryModel.findOne({ name: category.trim() });
    if (!cat) {
      cat = new CategoryModel({ name: category.trim() });
      await cat.save();
    }
    const newImage = new ImageModel({
      name: name?.trim() || "",
      category: category.trim(),
      imagePath: req.file.path,
    });
    await newImage.save();
    res.json({ success: true, image: newImage });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).send("Error uploading image");
  }
});

app.get("/api/upload/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const images = await ImageModel.find({ category });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching images");
  }
});

// ---------------- User Schema ----------------
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  name: String,
  email: String,
  picture: String,
});
const User = mongoose.model("User", userSchema, "userdata");

// ---------------- Google login API ----------------
app.post("/api/auth/google", async (req, res) => {
  try {
    const { code } = req.body;
    console.log("Received auth code:", code); // Debug log
    
    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    // Check environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Missing Google OAuth credentials in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage", // required for @react-oauth/google
        grant_type: "authorization_code",
      }),
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log("Token response received"); // Debug log

    const { access_token } = tokenRes.data;
    if (!access_token) {
      console.error("No access token received from Google");
      return res.status(500).json({ message: "Failed to get access token" });
    }

    // Fetch user profile
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { 
        headers: { Authorization: `Bearer ${access_token}` },
        timeout: 10000
      }
    );

    console.log("Profile data received:", profileRes.data); // Debug log

    const { id, name, email, picture } = profileRes.data;

    // Save or update user in MongoDB
    let user = await User.findOne({ googleId: id });
    if (!user) {
      console.log("Creating new user in userdata collection");
      user = new User({ googleId: id, name, email, picture });
      await user.save();
      console.log("User created successfully:", user._id);
    } else {
      console.log("Updating existing user");
      user.name = name;
      user.email = email;
      user.picture = picture;
      await user.save();
      console.log("User updated successfully");
    }

    // Return user info
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error("Detailed Google Auth Error:", err);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
    }
    return res.status(500).json({
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
  }
});

// ---------------- Latest Images Route ----------------
app.get("/api/images/latest", async (req, res) => {
  try {
    const latestImages = await ImageModel.find()
      .sort({ createdAt: -1 }) // sort newest first
      .limit(8); // only last 8 images
    res.json(latestImages);
  } catch (err) {
    console.error("Error fetching latest images:", err);
    res.status(500).send("Error fetching latest images");
  }
});

// Return all images
app.get("/api/images", async (req, res) => {
  try {
    const images = await ImageModel.find({});
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching images");
  }
});

// Delete image by ID
app.delete("/api/images/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid image ID" });
  }
  try {
    const image = await ImageModel.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (fs.existsSync(image.imagePath)) fs.unlinkSync(image.imagePath);

    await ImageModel.findByIdAndDelete(id);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
