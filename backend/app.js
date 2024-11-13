const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const apiRoutes = require("./routes/apiRoutes");
const dataRoutes = require("./routes/dataRoutes"); // Import the dataRoutes for campaign endpoint

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Add the /api route before using dataRoutes
app.use("/api", apiRoutes);
app.use("/api", dataRoutes); // Ensure this line is present for the campaign route

const PORT = process.env.PORT || 3047;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const db = require("./config/db");
// const apiRoutes = require("./routes/apiRoutes"); // Only using apiRoutes

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// // Use /api for all routes in apiRoutes
// app.use("/api", apiRoutes);

// const PORT = process.env.PORT || 3047;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
