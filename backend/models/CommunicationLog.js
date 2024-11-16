const mongoose = require("mongoose");

const communicationLogSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  audienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audience",
    required: true,
  },
  message: { type: String, required: true },
  status: { type: String, enum: ["SENT", "FAILED"], required: true },
  timestamp: { type: Date, default: Date.now },
});

const CommunicationLog = mongoose.model(
  "CommunicationLog",
  communicationLogSchema
);

module.exports = CommunicationLog;
