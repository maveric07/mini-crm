import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const CustomerSpendingReport = () => {
  const [data, setData] = useState([["Customer", "Total Spending"]]); // Initialize with header row
  const [loading, setLoading] = useState(true); // Track loading state
  const [chartType, setChartType] = useState("PieChart"); // Default chart type is PieChart

  useEffect(() => {
    // Fetch data from backend
    fetch("http://localhost:3047/api/customer-spending-report")
      .then((response) => response.json())
      .then((data) => {
        const chartData = [["Customer", "Total Spending"]];
        data.report.forEach((item) => {
          chartData.push([item.customerName, item.totalSpending]);
        });
        setData(chartData);
        setLoading(false); // Set loading to false after data is loaded
      })
      .catch((error) => {
        console.error("Error fetching report:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  // Handle change in chart type
  const handleChartChange = (event) => {
    setChartType(event.target.value);
  };

  // Define chart options based on the selected chart type
  const getChartOptions = () => {
    switch (chartType) {
      case "PieChart":
        return {
          title: "Total Spending by Customer",
          pieSliceText: "label",
          slices: {
            0: { offset: 0.1 },
            1: { offset: 0.1 },
          },
        };
      case "BarChart":
        return {
          title: "Total Spending by Customer",
          chartArea: { width: "50%" },
          hAxis: { title: "Total Spending" },
          vAxis: { title: "Customer" },
        };
      case "ColumnChart":
        return {
          title: "Total Spending by Customer",
          chartArea: { width: "50%" },
          hAxis: { title: "Customer" },
          vAxis: { title: "Total Spending" },
        };
      case "HeatMap":
        // Simulate heatmap with TableChart by styling cells based on spending
        return {
          showRowNumber: true,
          cssClassNames: {
            headerRow: "header-row",
            tableCell: "heatmap-cell", // Apply custom styling to table cells
          },
        };
      default:
        return {};
    }
  };

  // Format data for TableChart (simulated heatmap)
  const formatHeatMapData = () => {
    return data.map((row, index) => {
      if (index === 0) return row; // Skip header row
      const spending = row[1];
      let color = "#e0f7fa"; // Default color (light blue)
      if (spending > 10000) color = "high"; // Darker color for high spending
      else if (spending > 5000) color = "medium"; // Medium color
      else color = "low"; // Light color for low spending
      return [row[0], row[1], color];
    });
  };

  return (
    <div>
      <h3>Customer Spending Report</h3>

      {/* Dropdown to select chart type */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="chartType">Select Chart Type: </label>
        <select
          id="chartType"
          value={chartType}
          onChange={handleChartChange}
          style={{ padding: "5px", fontSize: "16px" }}
        >
          <option value="PieChart">Pie Chart</option>
          <option value="BarChart">Horizontal Bar Chart</option>
          <option value="ColumnChart">Vertical Bar Chart</option>
          <option value="HeatMap">Heatmap (Simulated)</option>
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p> // Show loading message while fetching
      ) : (
        <Chart
          chartType={chartType} // Dynamic chart type
          data={chartType === "HeatMap" ? formatHeatMapData() : data}
          width={"100%"}
          height={"400px"}
          options={getChartOptions()} // Dynamic options based on selected chart type
        />
      )}
    </div>
  );
};

export default CustomerSpendingReport;
