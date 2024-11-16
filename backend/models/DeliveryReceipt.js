const mongoose = require("mongoose");

const deliveryReceiptSchema = new mongoose.Schema({
  communicationLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommunicationLog",
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ["DELIVERED", "FAILED", "PENDING"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const DeliveryReceipt = mongoose.model(
  "DeliveryReceipt",
  deliveryReceiptSchema
);

module.exports = DeliveryReceipt;
