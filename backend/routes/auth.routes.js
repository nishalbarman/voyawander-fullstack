const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { UserModel } = require("../mongo/model");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL;

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      let user = await UserModel.findOne({ googleId: profile.id });
      if (user) {
        return cb(null, user);
      } else {
        user = new UserModel({ googleId: profile.id });
        await user.save();
        return cb(null, user);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await UserModel.findById(id);
  done(null, user);
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/auth/failed",
  })
);

router.get("/checklogin", (req, res) => {
  if (req.user) {
    return res.send({
      status: true,
      message: "Login success!",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    return res.send({
      status: false,
      message: "Login success!",
    });
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect(CLIENT_URL);
});

router.get("/failed", (req, res) => {
  res.send({ status: false, message: "Login failed!" });
});

module.exports = router;
