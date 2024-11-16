const express = require("express");
const router = express.Router();
const {
  getAudienceById,
  createCampaign,
  createAudienceSegment,
  getCustomerSpendingReport,
  addCustomer,
  addOrder,
  addOrderWithSpendingUpdate,
  getCustomers,
  getOrders,
  sendMessages, // Add this line
  updateDeliveryStatus, // Add this line
  getCampaignHistory, // Add this line
} = require("../controllers/dataController");

// Add this route in your router (probably inside routes/dataRoutes.js or similar file)
router.get("/audience/:id", getAudienceById); // Fetch audience by ID

// Routes related to campaigns and audience
router.post("/campaign", createCampaign);
router.post("/audience", createAudienceSegment);

// Report Generation
router.get("/customer-spending-report", getCustomerSpendingReport);

// Customer and Order Management
router.post("/customer", addCustomer);
router.post("/order", addOrder);
router.post("/order-with-spending-update", addOrderWithSpendingUpdate);

// Fetch Customers and Orders
router.get("/customers", getCustomers);
router.get("/orders", getOrders);

// New Routes for Message Sending and Delivery Status
router.post("/send-message", sendMessages); // Send message and log
router.post("/update-delivery-status", updateDeliveryStatus); // Update delivery status
router.get("/campaign-history/:campaignId", getCampaignHistory); // Get campaign history

module.exports = router;
