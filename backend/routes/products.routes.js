const express = require("express");
const jwt = require("jsonwebtoken");
const { ProductModel } = require("../mongo/model");
const router = express.Router();

const secret = process.env.SECRET || "XYZ";

const auth = (req, res, next) => {
  try {
    const token = req.get("Authorization");
    console.log(token);
    if (token) {
      const user = jwt.verify(token, secret);
      req.userid = user._id;
      next();
      return;
    }
    return res.send({ status: false, data: [], message: "Invalid Access!" });
  } catch (er) {
    res.send({ status: false, data: [], message: "Invalid Access!" });
  }
};

router.get("/", auth, async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = limit * (page - 1);

  const sorting = req.query.sort || null;
  const order = req.query.order || null;
  let dataPromise = null;
  let countPromise = null;
  let query = {}; // search query structure
  if (req.query.q) {
    // any search term
    query = { $text: { $search: req.query.q } };
  }

  if (req.query.category) {
    // appending the category field
    query.category = req.query.category;
  }

  console.log(query);

  if (sorting && order) {
    // with sorting
    countPromise = ProductModel.find(query)
      .sort({ [sorting]: order })
      .count();
    dataPromise = ProductModel.find(query)
      .sort({ [sorting]: order })
      .skip(skip)
      .limit(limit);
  } else {
    // without sorting
    countPromise = ProductModel.find(query).count();
    dataPromise = ProductModel.find(query).skip(skip).limit(limit);
  }

  // final result
  const [data, total] = await Promise.all([dataPromise, countPromise]);

  let msg = undefined;
  if (total == 0) {
    msg = "No data!";
  }

  res.setHeader("X-Total-Count", total);
  res.send({ total, data, msg });
});

module.exports = router;
