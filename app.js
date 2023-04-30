const express = require("express");
const morgan = require("morgan");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).send("It's working!");
});
