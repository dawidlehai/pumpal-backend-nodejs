const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: [true, "The reps field is required."],
    min: 0,
  },
  weight: { type: Number, min: 0 },
  _id: false,
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The exercise name is required."],
  },
  isBodyweight: { type: Boolean, default: false },
  sets: [setSchema],
  _id: false,
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A workout must belong to a user."],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: {
    type: [exerciseSchema],
    required: [true, "The exercises field is required."],
    minItems: [1, "There has to be at least one exercise in a workout."],
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
