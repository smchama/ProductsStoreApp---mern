// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER / SIGN UP ---
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔒 Automatically assign admin role if email matches your admin address
    const adminEmail = "smchama@gmail.com"; 
    const assignedRole = email.toLowerCase() === adminEmail.toLowerCase() ? "admin" : "customer";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- LOGIN / SIGN IN ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    // 🔒 Auto-promote existing account on login if it matches your admin email
    const adminEmail = "smchama@gmail.com";
    if (email.toLowerCase() === adminEmail.toLowerCase() && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {  
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- GET ALL USERS (ADMIN) ---
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- ADMIN RESET USER PASSWORD ---
export const adminResetUserPassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: `Password successfully reset for ${user.name || user.email}` });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// --- DELETE USER (ADMIN) ---
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};