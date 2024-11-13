//routes/apiRoutes.js
const express = require("express");
const {
  addCustomer,
  addOrder,
  getCustomers,
  getOrders,
  createAudienceSegment,
  getCustomerSpendingReport,
} = require("../controllers/dataController");
const router = express.Router();

router.post("/customers", addCustomer);
router.post("/orders", addOrder);
router.get("/customers", getCustomers);
router.get("/orders", getOrders);
router.post("/audience", createAudienceSegment);
router.get("/reports/customer-spending", getCustomerSpendingReport);

module.exports = router;
// const express = require("express");
// const {
//   createCampaign,
//   createAudienceSegment,
//   getCustomerSpendingReport,
//   addCustomer,
//   addOrder,
//   addOrderWithSpendingUpdate,
//   getCustomers,
//   getOrders,
// } = require("../controllers/dataController");

// const router = express.Router();

// // Campaign Routes
// router.post("/campaign", createCampaign);

// // Audience Segment Routes
// router.post("/audience", createAudienceSegment);

// // Customer Spending Report
// router.get("/customers/spending-report", getCustomerSpendingReport);

// // Customer Routes
// router.post("/customers", addCustomer);
// router.get("/customers", getCustomers);

// // Order Routes
// router.post("/orders", addOrder);
// router.post("/orders/spending-update", addOrderWithSpendingUpdate);
// router.get("/orders", getOrders);

// module.exports = router;
