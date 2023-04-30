const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;
const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => {
    console.log("Database connection established...");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  console.error("Unhandled rejection! Shutting down...");

  server.close(() => process.exit(1));
});
