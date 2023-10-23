require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;
require("./connect");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/auth", require("./routes/auth.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/contact", require("./routes/contacts.routes"));
app.use("/locations", require("./routes/location.routes"));

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
