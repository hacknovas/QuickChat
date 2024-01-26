const asyncHandler = require("express-async-handler");
const otpGenerator = require("otp-generator");
const nodeMailer = require("nodemailer");
const User = require("../models/userModel");
const generateTokent = require("../config/generateToken");
const otpModel = require("../models/otpVerification");

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

const otpRegister = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User Not Found");
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const result = new otpModel({
      email,
      otp,
    });

    await result.save();

    const mailer = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    await mailer.sendMail({
      from: "creatives.doni@gmail.com",
      to: email,
      subject: "Test Mail",
      text: `Hi! There, You have recently visited  
      our website and entered your email. 
      Just Login with Given OTP: \n
      ${otp}
      \nThanks`,
    });

    res.status(200).send({
      message: "Email Sent Successfuly",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed Authentication.");
  }
};

module.exports = { registerUser, authuser, allUsers, otpRegister };
