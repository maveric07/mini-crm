// // src/App.js
// import React from "react";
// import CustomerSpendingReport from "./components/CustomerSpendingReport";

// function App() {
//   return (
//     <div>
//       <h1>Management Information System</h1>
//       <CustomerSpendingReport />
//     </div>
//   );
// }

// export default App;

// src/App.js
import React from "react";
import CustomerSpendingReport from "./components/CustomerSpendingReport";
import CreateCampaign from "./components/CreateCampaign";

function App() {
  return (
    <div>
      <h1>Management Information System</h1>
      <CustomerSpendingReport />
      <CreateCampaign />
    </div>
  );
}

export default App;
