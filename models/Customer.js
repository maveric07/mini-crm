// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   total_spending: { type: Number, default: 0 },
//   last_visit: { type: Date },
// });

// module.exports = mongoose.model("Customer", customerSchema);
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  total_spending: { type: Number, default: 0 },
  last_visit: { type: Date },
});

module.exports = mongoose.model("Customer", customerSchema);
