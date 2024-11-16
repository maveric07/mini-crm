
import React, { useState } from "react";

const SendMessage = () => {
  const [campaignId, setCampaignId] = useState("");
  const [audienceId, setAudienceId] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3047/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          audienceId,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send the message.");
      }

      setResponse(data.message || "Message sent successfully.");
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h3>Send a Message</h3>
      <form onSubmit={handleSendMessage}>
        <div>
          <label>Campaign ID:</label>
          <input
            type="text"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            required
            placeholder="Enter Campaign ID"
          />
        </div>
        <div>
          <label>Audience ID:</label>
          <input
            type="text"
            value={audienceId}
            onChange={(e) => setAudienceId(e.target.value)}
            required
            placeholder="Enter Audience ID"
          />
        </div>
        <div>
          <label>Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter your message"
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default SendMessage;
