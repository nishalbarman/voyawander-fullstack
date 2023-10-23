const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { UserModel } = require("../mongo/model");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL;

const secret = process.env.SECRET || "XYZ";

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashed_password;
    const user = new UserModel(req.body);
    await user.save();
    return res.send({ status: true, message: "User created!" });
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.MongooseError) {
      return res.send({
        status: false,
        message: "Required fields are missing!",
      });
    }
    return res.send({ status: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    console.log(req.body);
    if (user) {
      const hashed = user.password;
      const result = bcrypt.compareSync(req.body.password, hashed);
      if (result) {
        const token = jwt.sign({ _id: user.id }, secret);
        return res.send({
          status: true,
          token: token,
          message: "Login Successful",
        });
      }
    }
    return res.send({ status: false, message: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.MongooseError) {
      return res.send({ status: false, message: "Invalid Credentials" });
    }
    return res.send({ status: false, message: "Invalid Credentials" });
  }
});

// passport.use(
//   new LocalStrategy(async function verify(useremail, password, cb) {
//     const user = await UserModel.findOne({ email: useremail });

//     if (!user) {
//       return cb(null, false, { message: "Incorrect email or password." });
//     }

//     crypto.pbkdf2(
//       password,
//       row.salt,
//       310000,
//       32,
//       "sha256",
//       function (err, hashedPassword) {
//         if (err) {
//           return cb(err);
//         }
//         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//           return cb(null, false, {
//             message: "Incorrect email or password.",
//           });
//         }
//         return cb(null, user);
//       }
//     );
//   })
// );

// google signin

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8000/auth/google/callback",
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//       let user = await UserModel.findOne({ googleId: profile.id });
//       if (user) {
//         return cb(null, user);
//       } else {
//         user = new UserModel({ googleId: profile.id });
//         await user.save();
//         return cb(null, user);
//       }
//     }
//   )
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(async function (id, done) {
//   const user = await UserModel.findById(id);
//   done(null, user);
// });

// router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/auth/failed",
//   })
// );

// router.get("/checklogin", (req, res) => {
//   if (req.user) {
//     return res.send({
//       status: true,
//       message: "Login success!",
//       user: req.user,
//       cookies: req.cookies,
//     });
//   } else {
//     return res.send({
//       status: false,
//       message: "Login success!",
//     });
//   }
// });

// router.get("/logout", (req, res) => {
//   req.logOut();
//   res.redirect(CLIENT_URL);
// });

// router.get("/failed", (req, res) => {
//   res.send({ status: false, message: "Login failed!" });
// });

module.exports = router;
