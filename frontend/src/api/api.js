import axios from "axios";

// Set the base URL for your API
const api = axios.create({
  baseURL: "http://localhost:5000", // Adjust to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
