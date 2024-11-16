// import React from "react";
// import AddAudienceSegment from "./components/AddAudienceSegment";
// import CustomerSpendingReport from "./components/CustomerSpendingReport";
// import CreateCampaign from "./components/CreateCampaign";
// import SendMessage from "./components/SendMessage";
// import UpdateDeliveryStatus from "./components/UpdateDeliveryStatus";
// import CampaignHistory from "./components/CampaignHistory";

// function App() {
//   return (
//     <div>
//       <h1>Management Information System</h1>
//       <AddAudienceSegment /> {/* Add your audience segment form here */}
//       <CustomerSpendingReport />{" "}
//       {/* You can add a spending report component here */}
//       <CreateCampaign /> {/* Campaign creation */}
//       <SendMessage /> {/* Send message */}
//       <UpdateDeliveryStatus /> {/* Update delivery status */}
      
//       <CampaignHistory /> {/* View campaign history */}
//     </div>
//   );
// }

// export default App;
import React from "react";
import AddAudienceSegment from "./components/AddAudienceSegment";
import CustomerSpendingReport from "./components/CustomerSpendingReport";
import CreateCampaign from "./components/CreateCampaign";
import SendMessage from "./components/SendMessage";
import UpdateDeliveryStatus from "./components/UpdateDeliveryStatus";
import CampaignHistory from "./components/CampaignHistory";
import "./App.css"; // Import CSS for the entire app

function App() {
  return (
    <div className="app-container">
      <h1 className="app-header">Management Information System</h1>
      <div className="components-container">
        <AddAudienceSegment />
        <CustomerSpendingReport />
        <CreateCampaign />
        <SendMessage />
        <UpdateDeliveryStatus />
        <CampaignHistory />
      </div>
    </div>
  );
}

export default App;
