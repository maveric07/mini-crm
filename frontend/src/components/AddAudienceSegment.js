// import React, { useState } from "react";
// import axios from "axios";

// const AddAudienceSegment = () => {
//   const [totalSpending, setTotalSpending] = useState("");
//   const [lastVisit, setLastVisit] = useState("");
//   const [visitCount, setVisitCount] = useState("");
//   const [responseMessage, setResponseMessage] = useState("");
//   const [audience, setAudience] = useState([]); // New state to hold audience data

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:3047/api/audience", {
//         totalSpending,
//         lastVisit,
//         visitCount,
//       });

//       setResponseMessage(
//         `Audience segment created successfully. Audience size: ${response.data.audienceSize}`
//       );
//       setAudience(response.data.audience); // Save the audience data to state
//     } catch (error) {
//       console.error("Error creating audience segment", error);
//       setResponseMessage("Failed to create audience segment");
//     }
//   };

//   return (
//     <div>
//       <h2>Create Audience Segment</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Total Spending</label>
//           <input
//             type="number"
//             value={totalSpending}
//             onChange={(e) => setTotalSpending(e.target.value)}
//             placeholder="Enter total spending filter"
//           />
//         </div>

//         <div>
//           <label>Last Visit</label>
//           <input
//             type="date"
//             value={lastVisit}
//             onChange={(e) => setLastVisit(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Visit Count</label>
//           <input
//             type="number"
//             value={visitCount}
//             onChange={(e) => setVisitCount(e.target.value)}
//             placeholder="Enter visit count filter"
//           />
//         </div>

//         <div>
//           <button type="submit">Create Segment</button>
//         </div>
//       </form>

//       {responseMessage && <p>{responseMessage}</p>}

//       {/* Show Audience Data after segment creation */}
//       {audience.length > 0 && (
//         <div>
//           <h3>Audience List</h3>
//           <ul>
//             {audience.map((user) => (
//               <li key={user._id}>
//                 <p>Name: {user.name}</p>
//                 <p>Email: {user.email}</p>
//                 <p>Total Spending: {user.total_spending}</p>
//                 <p>
//                   Last Visit: {new Date(user.last_visit).toLocaleDateString()}
//                 </p>
//                 <p>Visit Count: {user.visit_count}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddAudienceSegment;
import React, { useState } from "react";
import axios from "axios";

const AddAudienceSegment = () => {
  const [totalSpending, setTotalSpending] = useState("");
  const [lastVisit, setLastVisit] = useState("");
  const [visitCount, setVisitCount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [audience, setAudience] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3047/api/audience", {
        totalSpending,
        lastVisit,
        visitCount,
      });

      setResponseMessage(
        `Audience segment created successfully. Audience size: ${response.data.audienceSize}`
      );
      setAudience(response.data.audience);
    } catch (error) {
      console.error("Error creating audience segment", error);
      setResponseMessage("Failed to create audience segment");
    }
  };

  return (
    <div className="component">
      <h2>Create Audience Segment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Spending</label>
          <input
            type="number"
            value={totalSpending}
            onChange={(e) => setTotalSpending(e.target.value)}
            placeholder="Enter total spending filter"
          />
        </div>

        <div>
          <label>Last Visit</label>
          <input
            type="date"
            value={lastVisit}
            onChange={(e) => setLastVisit(e.target.value)}
          />
        </div>

        <div>
          <label>Visit Count</label>
          <input
            type="number"
            value={visitCount}
            onChange={(e) => setVisitCount(e.target.value)}
            placeholder="Enter visit count filter"
          />
        </div>

        <div>
          <button type="submit">Create Segment</button>
        </div>
      </form>

      {responseMessage && <p>{responseMessage}</p>}

      {audience.length > 0 && (
        <div>
          <h3>Audience List</h3>
          <ul>
            {audience.map((user) => (
              <li key={user._id}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Total Spending: {user.total_spending}</p>
                <p>
                  Last Visit: {new Date(user.last_visit).toLocaleDateString()}
                </p>
                <p>Visit Count: {user.visit_count}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddAudienceSegment;
