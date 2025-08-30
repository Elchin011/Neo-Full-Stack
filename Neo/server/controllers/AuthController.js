// authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/User/UserSchema");

// Şifrə hash-ləmə funksiyası
const HashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// REGISTER
const AuthRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Email mövcudluğunu yoxla
    const existUser = await UserSchema.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    // 2️⃣ Şifrəni hash-lə
    const hashPassword = await HashPassword(password);

    // 3️⃣ Yeni istifadəçi yarat
    const newUser = new UserSchema({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const AuthLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ İstifadəçini tap
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Şifrəni yoxla
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ JWT token yarat
    const payload = { id: user._id, email: user.email, roles: user.roles || [] };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4️⃣ Cookie və cavab göndər
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 saat
      })
      .json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { AuthRegister, AuthLogin };
