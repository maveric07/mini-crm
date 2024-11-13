import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const CustomerSpendingReport = () => {
  const [data, setData] = useState([["Customer", "Total Spending"]]); // Initialize with header row

  useEffect(() => {
    // Fetch data from backend
    fetch("http://localhost:3047/api/reports/customer-spending")
      .then((response) => response.json())
      .then((data) => {
        const chartData = [["Customer", "Total Spending"]];
        data.forEach((item) => {
          chartData.push([item.customerName, item.totalSpending]);
        });
        setData(chartData);
      })
      .catch((error) => console.error("Error fetching report:", error));
  }, []);

  return (
    <div>
      <h3>Customer Spending Report</h3>
      {data.length > 1 ? (
        <Chart
          chartType="PieChart"
          data={data}
          width={"100%"}
          height={"400px"}
          options={{
            title: "Total Spending by Customer",
            pieSliceText: "label",
            slices: {
              0: { offset: 0.1 },
              1: { offset: 0.1 },
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default CustomerSpendingReport;
