const catchAsync = require("./../utils/catchAsync");
const Workout = require("./../models/workoutModel");

exports.getAll = catchAsync(async (req, res, next) => {
  const { user } = req;

  let workouts = await Workout.find({ user: user.id });

  if (!workouts) workouts = [];

  res.status(200).json({
    status: "success",
    data: {
      workouts,
    },
  });
});
