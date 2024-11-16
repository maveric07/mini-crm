import React, { useState } from "react";
import axios from "axios";

const CampaignHistory = () => {
  const [campaignId, setCampaignId] = useState(""); // Store the input campaign ID
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3047/campaign-history/${campaignId}`
      );
      setHistory(response.data.history);
    } catch (err) {
      setError(
        "Error: " + (err.response ? err.response.data.message : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Campaign History</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Campaign ID"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {history.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Audience</th>
              <th>Status</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.message}</td>
                <td>{item.audience ? item.audience.name : "No Audience"}</td>
                <td>{item.status}</td>
                <td>{item.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {history.length === 0 && !loading && (
        <p>No history found for this campaign</p>
      )}
    </div>
  );
};

export default CampaignHistory;
