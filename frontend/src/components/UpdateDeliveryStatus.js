import React, { useState } from "react";

const UpdateDeliveryStatus = () => {
  const [campaignId, setCampaignId] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      const res = await fetch(
        "http://localhost:3047/api/update-delivery-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ campaignId, status }),
        }
      );
      const data = await res.json();
      setResponse(data.message || "Delivery status updated successfully");
    } catch (error) {
      setResponse("Failed to update delivery status. Please try again.");
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div>
      <h3>Update Delivery Status</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Campaign ID:</label>
          <input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button type="submit">Update Status</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default UpdateDeliveryStatus;
