const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username."],
    unique: true,
    validate: [validator.isAlphanumeric],
  },
  password: {
    type: String,
    required: [true, "Please provide password."],
    minlength: 6,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
