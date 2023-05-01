const catchAsync = require("./../utils/catchAsync");
const Workout = require("./../models/workoutModel");

exports.createWorkout = catchAsync(async (req, res, next) => {
  const newWorkout = await Workout.create({
    user: req.user.id,
    ...req.body,
  });

  console.log(req.body);

  res.status(201).json({
    status: "success",
    data: {
      workout: newWorkout, // TODO: disable __v property
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
