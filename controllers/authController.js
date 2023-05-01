const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

exports.signup = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  const newUser = await User.create({ username, password });

  createSendToken(newUser, 201, req, res);
});

function createSendToken(user, statusCode, req, res) {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure ?? req.headers("x-forwarded-proto") === "https",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        username: user.username,
      },
    },
  });
}

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}
