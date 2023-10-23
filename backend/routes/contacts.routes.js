const { Router } = require("express");
const { MessageModel } = require("../mongo/models");
const mongoose = require("mongoose");

const secret = process.env.SECRET || "xtdged";

const router = Router();

router.post("/add", async (req, res) => {
  try {
    const message = new MessageModel(req.body);
    console.log(message);
    await message.save();
    res.send({ status: true, message: "Message submitted!" });
  } catch (err) {
    if (err instanceof mongoose.Error) {
      const errors = [];
      for (key in err.errors) {
        errors.push(err.errors[key].properties.message);
      }
      res.status(400).send({ status: false, message: errors.join(", ") });
    } else {
      res.sendStatus(500);
    }
  }
});

module.exports = router;
