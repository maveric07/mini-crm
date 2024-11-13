//models / Campaign.js;
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  audienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audience",
    required: true,
  },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  status: { type: String, default: "PENDING" },
});

module.exports = mongoose.model("Campaign", campaignSchema);
// const mongoose = require("mongoose");

// const campaignSchema = new mongoose.Schema({
//   audienceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer", // Change Audience to Customer if you're referring to a Customer
//     required: true,
//   },
//   message: { type: String, required: true },
//   sentAt: { type: Date, default: Date.now },
//   status: { type: String, default: "PENDING" },
// });

// module.exports = mongoose.model("Campaign", campaignSchema);
