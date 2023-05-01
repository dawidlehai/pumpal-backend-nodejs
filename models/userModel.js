const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "The username field is empty. Please provide a username."],
    unique: true,
    validate: [
      validator.isAlphanumeric,
      "The username contains invalid characters. Please use only letters and numbers.",
    ],
    minlength: [
      3,
      "The username is too short. Please provide at least 3 characters.",
    ],
  },
  password: {
    type: String,
    required: [true, "The password field is empty. Please provide a password."],
    minlength: [
      6,
      "The password is too short. Please provide at least 6 characters.",
    ],
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 16);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
