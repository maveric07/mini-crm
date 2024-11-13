// src/components/CreateCampaign.js
import React, { useState } from "react";

const CreateCampaign = () => {
  const [audienceId, setAudienceId] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3047/api/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audienceId, message }),
      });
      const data = await res.json();
      setResponse(data.message || "Campaign created successfully");
    } catch (error) {
      setResponse("Failed to create campaign. Please try again.");
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div>
      <h3>Create a New Campaign</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Audience ID:</label>
          <input
            type="text"
            value={audienceId}
            onChange={(e) => setAudienceId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default CreateCampaign;
