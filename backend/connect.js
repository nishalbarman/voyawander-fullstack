const mongoose = require("mongoose");
const mongo = process.env.MONGO_URI;
mongoose.connect(mongo);
