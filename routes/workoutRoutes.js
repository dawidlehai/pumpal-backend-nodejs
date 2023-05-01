const express = require("express");

const workoutController = require("../controllers/workoutController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, workoutController.getAllWorkouts)
  .post(authController.protect, workoutController.createWorkout);

module.exports = router;
