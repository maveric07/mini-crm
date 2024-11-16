// //models/Customer.js

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  total_spending: { type: Number, default: 0 },
  last_visit: { type: Date },
  visit_count: { type: Number, default: 0 }, // Track the visit count
});

module.exports = mongoose.model("Customer", customerSchema);
