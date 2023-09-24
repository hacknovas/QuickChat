const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateTokent = require("../config/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Please Enter All fields");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      userExist.status(400);
      throw new Error("User Already created");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateTokent(user._id),
      });
    } else {
      res.status(400);
      throw new Error("User Not Found");
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

const authuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPass(password))) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateTokent(user._id),
      });
    } else {
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    res.status(401).send("User Not available");
  }
};

const allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    email: req.query.search,
  }).find({ _id: { $ne: req.user._id } });

  console.log(users);
  res.send(users);
});

module.exports = { registerUser, authuser, allUsers };
