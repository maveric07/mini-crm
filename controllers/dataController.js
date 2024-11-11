// const Customer = require("../models/Customer");
// const Order = require("../models/Order");

// // Add a new customer
// const addCustomer = async (req, res) => {
//   const { name, email, total_spending, last_visit } = req.body;

//   try {
//     const customer = new Customer({ name, email, total_spending, last_visit });
//     await customer.save();
//     res.status(201).json({
//       message: "Customer added successfully",
//       customerId: customer._id,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Add a new order
// const addOrder = async (req, res) => {
//   const { customer_id, amount, order_date } = req.body;

//   try {
//     const order = new Order({ customer_id, amount, order_date });
//     await order.save();
//     res
//       .status(201)
//       .json({ message: "Order added successfully", orderId: order._id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { addCustomer, addOrder };

const Customer = require("../models/Customer");
const Order = require("../models/Order");

// Add a new customer
const addCustomer = async (req, res) => {
  const { name, email, total_spending, last_visit } = req.body;

  try {
    const customer = new Customer({ name, email, total_spending, last_visit });
    await customer.save();
    res.status(201).json({
      message: "Customer added successfully",
      customerId: customer._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new order
const addOrder = async (req, res) => {
  const { customer_id, amount, order_date } = req.body;

  try {
    const order = new Order({ customer_id, amount, order_date });
    await order.save();
    res
      .status(201)
      .json({ message: "Order added successfully", orderId: order._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addCustomer, addOrder, getCustomers, getOrders };
