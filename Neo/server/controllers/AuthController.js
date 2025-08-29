const bcyrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/User/UserSchema");
const UserSchema = require("../models/User/UserSchema");
const { HashPassword } = require("../lib/hasPassword");

const AuthRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const exsistUser = userSchema.findOne({ email: email });
  if (!exsistUser) {
    return res.status(404).json({
      message: "Email already used",
    });
  }
  const hashPassword = await HashPassword();
  const userData = {
    name: name,
    email: email,
    password: hashPassword,
  };
  const newUser = new UserSchema(userData);
  await newUser.save();

  return res.status(201).json({
    data: newUser,
  });
};

const AuthLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  const isMatch = await bcyrpt.compare(password, user.password);
  if (isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const payload = {
    id: user._id,
    email: user.email,
    password: user.password,
    roles: user.roles,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res
    .cookie("token", token, {
      httpOnly: false,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      maxAge: 3600000,
    })
    .json({
      message: "Login successful",
      token: token,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
};

module.exports = { AuthRegister, AuthLogin };
