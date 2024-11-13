const Joi = require("joi");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Audience = require("../models/Audience");
const Campaign = require("../models/Campaign");

// Create a new campaign
exports.createCampaign = async (req, res) => {
  const { audienceId, message } = req.body;

  try {
    // Check if the audience segment exists
    const audience = await Audience.findById(audienceId);
    if (!audience) {
      return res.status(400).json({ message: "Audience segment not found" });
    }

    // Save the campaign data
    const campaign = new Campaign({
      audienceId,
      message,
      status: "PENDING",
    });

    await campaign.save();

    res
      .status(201)
      .json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Failed to create campaign", error });
  }
};

// Filter for audience segments
exports.createAudienceSegment = async (req, res) => {
  const { totalSpending, lastVisit, visitCount } = req.body;

  try {
    let query = {};

    // Define conditions based on input filters
    if (totalSpending) {
      query.total_spending = { $gte: totalSpending };
    }

    if (lastVisit) {
      query.last_visit = { $lte: new Date(lastVisit) }; // For customers who haven’t visited in a while
    }

    if (visitCount) {
      query.visit_count = { $lte: visitCount }; // Assume we have a field for visit count
    }

    // Find customers who match the conditions
    const audience = await Customer.find(query);
    const audienceSize = audience.length;

    // Create and save the audience segment to the Audience collection
    const newAudienceSegment = new Audience({
      filters: { totalSpending, lastVisit, visitCount },
      customerIds: audience.map((cust) => cust._id), // Store customer ids in the audience segment
      audienceSize,
    });

    await newAudienceSegment.save(); // Save the segment to the database

    res
      .status(200)
      .json({ message: "Audience segment created", audienceSize, audience });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create audience segment", error });
  }
};

// Validation Schema for Customer
const customerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  total_spending: Joi.number().min(0).optional(),
  last_visit: Joi.date().optional(),
});

// Aggregation for total spending by each customer
exports.getCustomerSpendingReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$customer_id",
          totalSpending: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      {
        $project: {
          customerName: "$customerDetails.name",
          totalSpending: 1,
        },
      },
    ]);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate report", error });
  }
};

// Add a new customer with validation
exports.addCustomer = async (req, res) => {
  const { error } = customerSchema.validate(req.body); // Validate request body
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: "Customer added successfully", customer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add customer", error: error.message });
  }
};

// Validation Schema for Order
const orderSchema = Joi.object({
  customer_id: Joi.string().hex().length(24).required(), // Validate ObjectId format
  amount: Joi.number().required(),
  order_date: Joi.date().required(),
});

// Add a new order with validation
exports.addOrder = async (req, res) => {
  // Step 1: Validate that the customer_id exists in the database
  try {
    const customer = await Customer.findById(req.body.customer_id);
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Step 2: Create the order if the customer exists
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order added successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add order", error: error.message });
  }
};

// Add a new order with total_spending update
exports.addOrderWithSpendingUpdate = async (req, res) => {
  const { error } = orderSchema.validate(req.body); // Validate request body
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Save the order
    const order = new Order(req.body);
    await order.save();

    // Update the total_spending of the customer
    const customer = await Customer.findById(order.customer_id);
    if (customer) {
      customer.total_spending += order.amount; // Add the order amount to total_spending
      await customer.save();
    }

    res.status(201).json({ message: "Order added successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add order", error: error.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve customers", error });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer_id");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};

// //controleers/dataController.js

// const Joi = require("joi");
// const Customer = require("../models/Customer");
// const Order = require("../models/Order");
// const Audience = require("../models/Audience");
// const Campaign = require("../models/Campaign");

// // Create a new campaign
// exports.createCampaign = async (req, res) => {
//   const { audienceId, message } = req.body;

//   try {
//     // Check if the audience segment exists
//     const audience = await Audience.findById(audienceId);
//     if (!audience) {
//       return res.status(400).json({ message: "Audience segment not found" });
//     }

//     // Save the campaign data
//     const campaign = new Campaign({
//       audienceId,
//       message,
//       status: "PENDING",
//     });

//     await campaign.save();

//     res
//       .status(201)
//       .json({ message: "Campaign created successfully", campaign });
//   } catch (error) {
//     console.error("Error creating campaign:", error);
//     res.status(500).json({ message: "Failed to create campaign", error });
//   }
// };

// // Filter for audience segments
// exports.createAudienceSegment = async (req, res) => {
//   const { totalSpending, lastVisit, visitCount } = req.body;

//   try {
//     let query = {};

//     // Define conditions based on input filters
//     if (totalSpending) {
//       query.total_spending = { $gte: totalSpending };
//     }

//     if (lastVisit) {
//       query.last_visit = { $lte: new Date(lastVisit) }; // For customers who haven’t visited in a while
//     }

//     if (visitCount) {
//       query.visit_count = { $lte: visitCount }; // Assume we have a field for visit count
//     }

//     // Find customers who match the conditions
//     const audience = await Customer.find(query);
//     const audienceSize = audience.length;

//     // Create and save the audience segment to the Audience collection
//     const newAudienceSegment = new Audience({
//       filters: { totalSpending, lastVisit, visitCount },
//       customerIds: audience.map((cust) => cust._id), // Store customer ids in the audience segment
//       audienceSize,
//     });

//     await newAudienceSegment.save(); // Save the segment to the database

//     res
//       .status(200)
//       .json({ message: `Audience segment created`, audienceSize, audience });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to create audience segment", error });
//   }
// };

// // Validation Schema for Customer
// const customerSchema = Joi.object({
//   name: Joi.string().min(3).required(),
//   email: Joi.string().email().required(),
//   total_spending: Joi.number().min(0).optional(),
//   last_visit: Joi.date().optional(),
// });

// // Aggregation for total spending by each customer
// exports.getCustomerSpendingReport = async (req, res) => {
//   try {
//     const report = await Order.aggregate([
//       {
//         $group: {
//           _id: "$customer_id",
//           totalSpending: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "customers",
//           localField: "_id",
//           foreignField: "_id",
//           as: "customerDetails",
//         },
//       },
//       { $unwind: "$customerDetails" },
//       {
//         $project: {
//           customerName: "$customerDetails.name",
//           totalSpending: 1,
//         },
//       },
//     ]);
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to generate report", error });
//   }
// };

// // Add a new customer with validation
// exports.addCustomer = async (req, res) => {
//   const { error } = customerSchema.validate(req.body); // Validate request body
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res.status(201).json({ message: "Customer added successfully", customer });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add customer", error: error.message });
//   }
// };

// // Validation Schema for Order
// const orderSchema = Joi.object({
//   customer_id: Joi.string().hex().length(24).required(), // Validate ObjectId format
//   amount: Joi.number().required(),
//   order_date: Joi.date().required(),
// });

// // Add a new order with validation
// exports.addOrder = async (req, res) => {
//   // Step 1: Validate that the customer_id exists in the database
//   try {
//     const customer = await Customer.findById(req.body.customer_id);
//     if (!customer) {
//       return res.status(400).json({ message: "Customer not found" });
//     }

//     // Step 2: Create the order if the customer exists
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json({ message: "Order added successfully", order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add order", error: error.message });
//   }
// };

// // Add a new order with total_spending update
// exports.addOrderWithSpendingUpdate = async (req, res) => {
//   const { error } = orderSchema.validate(req.body); // Validate request body
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     // Save the order
//     const order = new Order(req.body);
//     await order.save();

//     // Update the total_spending of the customer
//     const customer = await Customer.findById(order.customer_id);
//     if (customer) {
//       customer.total_spending += order.amount; // Add the order amount to total_spending
//       await customer.save();
//     }

//     res.status(201).json({ message: "Order added successfully", order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add order", error: error.message });
//   }
// };

// // Get all customers
// exports.getCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve customers", error });
//   }
// };

// // Get all orders
// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("customer_id");
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve orders", error });
//   }
// };

// const Joi = require("joi");
// const Customer = require("../models/Customer");
// const Order = require("../models/Order");
// const Audience = require("../models/Audience");
// const Campaign = require("../models/Campaign");

// // Create a new campaign
// exports.createCampaign = async (req, res) => {
//   const { audienceId, message } = req.body;

//   try {
//     const audience = await Audience.findById(audienceId);
//     if (!audience) {
//       return res.status(400).json({ message: "Audience segment not found" });
//     }

//     const campaign = new Campaign({
//       audienceId,
//       message,
//       status: "PENDING",
//     });

//     await campaign.save();
//     res
//       .status(201)
//       .json({ message: "Campaign created successfully", campaign });
//   } catch (error) {
//     console.error("Error creating campaign:", error);
//     res.status(500).json({ message: "Failed to create campaign", error });
//   }
// };

// // Create an audience segment based on filters
// exports.createAudienceSegment = async (req, res) => {
//   const { totalSpending, lastVisit, visitCount } = req.body;

//   try {
//     let query = {};

//     if (totalSpending) query.total_spending = { $gte: totalSpending };
//     if (lastVisit) query.last_visit = { $lte: new Date(lastVisit) };
//     if (visitCount) query.visit_count = { $lte: visitCount };

//     const audience = await Customer.find(query);
//     const audienceSize = audience.length;

//     const newAudienceSegment = new Audience({
//       filters: { totalSpending, lastVisit, visitCount },
//       customerIds: audience.map((cust) => cust._id),
//       audienceSize,
//     });

//     await newAudienceSegment.save();
//     res
//       .status(200)
//       .json({ message: "Audience segment created", audienceSize, audience });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to create audience segment", error });
//   }
// };

// // Validation Schema for Customer
// const customerSchema = Joi.object({
//   name: Joi.string().min(3).required(),
//   email: Joi.string().email().required(),
//   total_spending: Joi.number().min(0).optional(),
//   last_visit: Joi.date().optional(),
// });

// // Aggregation for total spending by each customer
// exports.getCustomerSpendingReport = async (req, res) => {
//   try {
//     const report = await Order.aggregate([
//       {
//         $group: {
//           _id: "$customer_id",
//           totalSpending: { $sum: "$amount" },
//         },
//       },
//       {
//         $lookup: {
//           from: "customers",
//           localField: "_id",
//           foreignField: "_id",
//           as: "customerDetails",
//         },
//       },
//       { $unwind: "$customerDetails" },
//       {
//         $project: {
//           customerName: "$customerDetails.name",
//           totalSpending: 1,
//         },
//       },
//     ]);
//     res.status(200).json(report);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to generate report", error });
//   }
// };

// // Add a new customer with validation
// exports.addCustomer = async (req, res) => {
//   const { error } = customerSchema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const customer = new Customer(req.body);
//     await customer.save();
//     res.status(201).json({ message: "Customer added successfully", customer });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add customer", error: error.message });
//   }
// };

// // Validation Schema for Order
// const orderSchema = Joi.object({
//   customer_id: Joi.string().hex().length(24).required(),
//   amount: Joi.number().required(),
//   order_date: Joi.date().required(),
// });

// // Add a new order with validation
// exports.addOrder = async (req, res) => {
//   const { error } = orderSchema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const customer = await Customer.findById(req.body.customer_id);
//     if (!customer) {
//       return res.status(400).json({ message: "Customer not found" });
//     }

//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json({ message: "Order added successfully", order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add order", error: error.message });
//   }
// };

// // Add a new order with total spending update
// exports.addOrderWithSpendingUpdate = async (req, res) => {
//   const { error } = orderSchema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const order = new Order(req.body);
//     await order.save();

//     const customer = await Customer.findById(order.customer_id);
//     if (customer) {
//       customer.total_spending += order.amount;
//       await customer.save();
//     }

//     res.status(201).json({ message: "Order added successfully", order });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to add order", error: error.message });
//   }
// };

// // Get all customers
// exports.getCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve customers", error });
//   }
// };

// // Get all orders
// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("customer_id");
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to retrieve orders", error });
//   }
// };
