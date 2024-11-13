//models/Audience.js
const mongoose = require("mongoose");

const audienceSchema = new mongoose.Schema({
  total_spending: { type: Number, default: 0 },
  // Add other necessary fields that match your criteria
});

module.exports = mongoose.model("Audience", audienceSchema);
// const mongoose = require("mongoose");

// const audienceSchema = new mongoose.Schema({
//   filters: {
//     totalSpending: Number,
//     lastVisit: Date,
//     visitCount: Number,
//   },
//   customerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
//   audienceSize: Number,
// });

// const Audience = mongoose.model("Audience", audienceSchema);
// module.exports = Audience;
