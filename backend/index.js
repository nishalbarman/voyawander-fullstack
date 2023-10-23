require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const { UserModel } = require("./mongo/model");

const port = process.env.PORT || 8000;

require("./connect");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/contact", require("./routes/contacts.routes"));
app.use("/locations", require("./routes/location.routes"));
app.use("/orders", require("./routes/orders.routes"));
app.use("/*", (req, res) => {
  res.send("Not allowed!");
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
