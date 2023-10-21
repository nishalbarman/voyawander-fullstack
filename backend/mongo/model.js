const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, required: trure },
  email: { type: String, required: trure },
  logtype: { type: Number, required: trure }, // login type to check whether user logged using google or id pass
  password: { type: String, required: trure },
});
