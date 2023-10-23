const mongoose = require("mongoose");

// schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  logtype: { type: Number, required: true }, // login type to check whether user logged using google or id pass
  password: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, required: true },
  carousel: { type: Array, required: true },
});

productSchema.index({ "$**": "text" }); // will help us in terms of searching for particular string

// models
const UserModel = mongoose.model("users", userSchema);
const ProductModel = mongoose.model("products", productSchema);

module.exports = { UserModel, ProductModel };
