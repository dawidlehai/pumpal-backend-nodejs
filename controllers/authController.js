const mongoose = require("mongoose");
const User = require("./../models/userModel");

exports.signup = async (req, res, next) => {
  const { body } = req;

  const newUser = await User.create({
    username: body.username,
    password: body.password,
  });

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
};
