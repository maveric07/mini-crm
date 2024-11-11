// const express = require("express");
// const bodyParser = require("body-parser");
// const apiRoutes = require("./routes/apiRoutes");
// const dotenv = require("dotenv");
// const db = require("./config/db"); // Initializes MongoDB connection

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3037;

// app.use(bodyParser.json());
// app.use("/api", apiRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/apiRoutes");
const dotenv = require("dotenv");
const db = require("./config/db"); // MongoDB connection setup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3047;

app.use(bodyParser.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
