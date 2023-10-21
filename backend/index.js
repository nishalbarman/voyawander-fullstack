require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
require("./connect");
const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
