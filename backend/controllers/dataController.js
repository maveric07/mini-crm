const Joi = require("joi");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Audience = require("../models/Audience");
const Campaign = require("../models/Campaign");
const mongoose = require("mongoose");
// Validation Schema for Customer
const customerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  total_spending: Joi.number().min(0).optional(),
  last_visit: Joi.date().optional(),
});

const CommunicationLog = require("../models/CommunicationLog");

exports.sendMessages = async (req, res) => {
  const { campaignId, audienceId, message } = req.body;

  try {
    // Log the message as SENT
    const communicationLog = new CommunicationLog({
      campaignId,
      audienceId,
      message,
      status: "SENT",
    });

    await communicationLog.save();
    res.status(200).json({
      message: "Message sent and logged successfully",
      communicationLog,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
};
const DeliveryReceipt = require("../models/DeliveryReceipt");

exports.updateDeliveryStatus = async (req, res) => {
  const { communicationLogId, deliveryStatus } = req.body;

  try {
    // Update delivery status
    const deliveryReceipt = new DeliveryReceipt({
      communicationLogId,
      deliveryStatus,
    });

    await deliveryReceipt.save();
    res
      .status(200)
      .json({ message: "Delivery status updated", deliveryReceipt });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({
      message: "Failed to update delivery status",
      error: error.message,
    });
  }
};
// exports.getCampaignHistory = async (req, res) => {
//   const { campaignId } = req.params;

//   try {
//     // Ensure campaignId is in the correct format
//     if (!mongoose.Types.ObjectId.isValid(campaignId)) {
//       return res.status(400).json({ message: "Invalid campaign ID format" });
//     }

//     // Get all communication logs related to this campaign and populate audienceId
//     const communicationLogs = await CommunicationLog.find({
//       campaignId: mongoose.Types.ObjectId(campaignId),
//     }).populate("audienceId");

//     if (communicationLogs.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No history found for this campaign" });
//     }

//     // Pre-fetch all delivery receipts in a single query
//     const deliveryReceipts = await DeliveryReceipt.find({
//       communicationLogId: { $in: communicationLogs.map((log) => log._id) },
//     });

//     // Create a map for quick lookup of delivery statuses
//     const deliveryStatusMap = {};
//     deliveryReceipts.forEach((receipt) => {
//       deliveryStatusMap[receipt.communicationLogId] = receipt.deliveryStatus;
//     });

//     // Map through logs and enrich with delivery status
//     const history = communicationLogs.map((log) => ({
//       message: log.message,
//       audience: log.audienceId,
//       status: log.status,
//       deliveryStatus: deliveryStatusMap[log._id] || "PENDING",
//     }));

//     res.status(200).json({
//       message: "Campaign history retrieved successfully",
//       history,
//     });
//   } catch (error) {
//     console.error("Error retrieving campaign history:", error);
//     res.status(500).json({
//       message: "Failed to retrieve campaign history",
//       error: error.message,
//     });
//   }
// };

exports.getCampaignHistory = async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Ensure campaignId is in the correct format
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ message: "Invalid campaign ID format" });
    }

    // Get all communication logs related to this campaign and populate audienceId
    const communicationLogs = await CommunicationLog.find({
      campaignId: new mongoose.Types.ObjectId(campaignId), // Add 'new' here
    }).populate("audienceId");

    if (communicationLogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for this campaign" });
    }

    // Pre-fetch all delivery receipts in a single query
    const deliveryReceipts = await DeliveryReceipt.find({
      communicationLogId: { $in: communicationLogs.map((log) => log._id) },
    });

    // Create a map for quick lookup of delivery statuses
    const deliveryStatusMap = {};
    deliveryReceipts.forEach((receipt) => {
      deliveryStatusMap[receipt.communicationLogId] = receipt.deliveryStatus;
    });

    // Map through logs and enrich with delivery status
    const history = communicationLogs.map((log) => ({
      message: log.message,
      audience: log.audienceId,
      status: log.status,
      deliveryStatus: deliveryStatusMap[log._id] || "PENDING",
    }));

    res.status(200).json({
      message: "Campaign history retrieved successfully",
      history,
    });
  } catch (error) {
    console.error("Error retrieving campaign history:", error);
    res.status(500).json({
      message: "Failed to retrieve campaign history",
      error: error.message,
    });
  }
};

// Fetch audience by ID
exports.getAudienceById = async (req, res) => {
  const { id } = req.params;

  try {
    const audience = await Audience.findById(id); // Fetch audience by ID

    if (!audience) {
      return res.status(404).json({ message: "Audience not found" });
    }

    res.status(200).json(audience);
  } catch (error) {
    console.error("Error fetching audience:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch audience", error: error.message });
  }
};

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
// Filter for audience segments
exports.createAudienceSegment = async (req, res) => {
  const { totalSpending, lastVisit, visitCount } = req.body;

  try {
    let query = {};

    // Define conditions based on input filters
    if (totalSpending) {
      query.total_spending = { $gte: totalSpending }; // customers who spent more than totalSpending
    }

    if (lastVisit) {
      query.last_visit = { $lte: new Date(lastVisit) }; // customers who haven't visited since lastVisit date
    }

    if (visitCount) {
      query.visit_count = { $lte: visitCount }; // Assuming a visit count field is present on the customer schema
    }

    console.log("Audience Query:", query); // Log for debugging

    // Find customers matching these conditions
    const audience = await Customer.find(query);
    const audienceSize = audience.length;

    // Create and save the audience segment to the Audience collection
    const newAudienceSegment = new Audience({
      filters: { totalSpending, lastVisit, visitCount },
      customerIds: audience.map((cust) => cust._id), // Store customer ids in the audience segment
      audienceSize,
    });

    console.log("Audience Segment:", newAudienceSegment);

    await newAudienceSegment.save(); // Save the segment to the database

    res.status(200).json({
      message: "Audience segment created successfully",
      audienceSize,
      audience: audience, // Return the list of customers in the segment
    });
  } catch (error) {
    console.error("Error creating audience segment:", error);
    res.status(500).json({
      message: "Failed to create audience segment",
      error: error.message,
    });
  }
};

// Aggregation for total spending by each customer
exports.getCustomerSpendingReport = async (req, res) => {
  try {
    // Aggregation to calculate total spending per customer
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$customer_id", // Group by customer_id
          totalSpending: { $sum: "$amount" }, // Sum the 'amount' of all orders for each customer
        },
      },
      {
        $lookup: {
          from: "customers", // Join with the customers collection
          localField: "_id", // Match the _id from the Order with _id from Customer
          foreignField: "_id", // The field in the customers collection to join on
          as: "customerDetails", // Alias for the joined customer data
        },
      },
      {
        $unwind: "$customerDetails", // Flatten the customerDetails array to access the name
      },
      {
        $project: {
          customerName: "$customerDetails.name", // Include the customer's name from the customerDetails
          totalSpending: 1, // Include the calculated totalSpending
        },
      },
    ]);

    // If there are no results
    if (report.length === 0) {
      return res.status(404).json({ message: "No spending data available" });
    }

    // Return the aggregated report
    res.status(200).json({
      message: "Customer spending report generated successfully",
      report, // Send the report array, which contains customer spending data
    });
  } catch (error) {
    console.error("Error in customer spending report:", error);
    res.status(500).json({
      message: "Failed to generate spending report",
      error: error.message,
    });
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
    console.error("Error in addOrder:", error);
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
      await customer.save(); // Persist the updated total_spending
    }

    res.status(201).json({
      message: "Order added and total spending updated successfully",
      order,
      updatedCustomer: customer, // Return the updated customer details
    });
  } catch (error) {
    console.error("Error in addOrderWithSpendingUpdate:", error);
    res.status(500).json({
      message: "Failed to add order and update customer spending",
      error: error.message,
    });
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
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: "Failed to retrieve orders", error });
  }
};
