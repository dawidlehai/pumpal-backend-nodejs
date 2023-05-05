const mongoose = require("mongoose");
const catchAsync = require("./../utils/catchAsync");
const Workout = require("./../models/workoutModel");
const AppError = require("../utils/appError");

exports.createWorkout = catchAsync(async (req, res, next) => {
  const {
    _id: id,
    user,
    date,
    exercises,
  } = await Workout.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json({
    status: "success",
    data: {
      workout: { id, user, date, exercises },
    },
  });
});

exports.getAllWorkouts = catchAsync(async (req, res, next) => {
  let workouts = await Workout.find({ user: req.user.id });

  if (!workouts) workouts = [];

  res.status(200).json({
    status: "success",
    data: {
      workouts,
    },
  });
});

exports.updateWorkout = catchAsync(async (req, res, next) => {
  const { id: workoutId } = req.params;

  const workoutToUpdate = await Workout.findById(workoutId);

  if (!workoutToUpdate) {
    const message = `Could not find a workout with the id of ${workoutId}.`;
    return next(
      new AppError(message, 401, "fail", {
        workout: message,
      })
    );
  }

  if (req.user.id !== workoutToUpdate.user.toString()) {
    const message = `You are not permitted to edit a workout with the id of ${workoutId}.`;
    return next(
      new AppError(message, 403, "fail", {
        workout: message,
      })
    );
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(workoutId, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  const { _id: id, user, date, exercises } = updatedWorkout;

  res.status(200).json({
    status: "success",
    data: {
      workout: { id, user, date, exercises },
    },
  });
});
