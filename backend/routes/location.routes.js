const express = require("express");
const { LocationModel } = require("../mongo/model");
const router = express.Router();

router.get("/", async (req, res) => {
  let query = {}; // search query structure

  if (req.query.category) {
    // appending the category field
    query.category = req.query.category;
  }

  const data = await LocationModel.find(query);

  res.send(
    data.map((item) => {
      return item.place;
    })
  );
});

module.exports = router;
