const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (authorization?.startsWith("Bearer")) token = authorization.split(" ")[1];

  if (!token) {
    const message = "You are not logged in. Please log in to get access.";
    return next(new AppError(message, 401, "fail", { message }));
  }

  const decodedUserData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedUserData.id);
  if (!currentUser) {
    const message = "There is no such user in the database. Access denied.";
    return next(new AppError(message, 401, "fail", { username: message }));
  }

  req.user = currentUser;

  next();
});

exports.signup = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const newUser = await User.create({ username, password });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const data = {
      username: username ? undefined : "The username field cannot be empty.",
      password: password ? undefined : "The password field cannot be empty.",
    };

    return next(
      new AppError("Please provide username and password.", 400, "fail", data)
    );
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user)
    return next(
      new AppError("Incorrect username.", 401, "fail", {
        username:
          "The username is incorrect. There is no such user in the database.",
      })
    );

  if (!(await user.isPasswordCorrect(password, user.password)))
    return next(
      new AppError("Incorrect password.", 401, "fail", {
        password: "The password is incorrect. Please try again.",
      })
    );

  createSendToken(user, 200, req, res);
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
