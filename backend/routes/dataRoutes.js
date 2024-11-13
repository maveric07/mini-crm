// // routes/dataRoutes.js
// const express = require("express");
// const router = express.Router();
// const { createCampaign } = require("../controllers/dataController");

// router.post("/campaign", createCampaign); // POST /campaign to create campaign

// module.exports = router;

// routes/dataRoutes.js
const express = require("express");
const { createCampaign } = require("../controllers/dataController");
const router = express.Router();

router.post("/campaign", createCampaign);

module.exports = router;
