// const express = require("express");
// const { addCustomer, addOrder } = require("../controllers/dataController");
// const router = express.Router();

// router.post("/customers", addCustomer);
// router.post("/orders", addOrder);

// module.exports = router;

const express = require("express");
const {
  addCustomer,
  addOrder,
  getCustomers,
  getOrders,
} = require("../controllers/dataController");
const router = express.Router();

router.post("/customers", addCustomer);
router.post("/orders", addOrder);
router.get("/customers", getCustomers);
router.get("/orders", getOrders);

module.exports = router;
