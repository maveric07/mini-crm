 //models/Audience.js

const mongoose = require("mongoose");

const audienceSchema = new mongoose.Schema({
  filters: {
    totalSpending: { type: Number, default: 0 },
    lastVisit: { type: Date },
    visitCount: { type: Number },
  },
  customerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
  audienceSize: { type: Number, default: 0 }, // To store the number of customers in this segment
});

module.exports = mongoose.model("Audience", audienceSchema);
