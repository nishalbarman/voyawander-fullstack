const mongoose = require("mongoose");

// schemas
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  logtype: { type: Number }, // login type to check whether user logged using google or id pass
  password: { type: String },
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

const messageSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    message: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const locationSchema = new mongoose.Schema(
  {
    place: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// models
const UserModel = mongoose.model("users", userSchema);
const ProductModel = mongoose.model("products", productSchema);
const MessageModel = mongoose.model("messages", messageSchema);
const LocationModel = mongoose.model("locations", locationSchema);

module.exports = { UserModel, ProductModel, MessageModel, LocationModel };
