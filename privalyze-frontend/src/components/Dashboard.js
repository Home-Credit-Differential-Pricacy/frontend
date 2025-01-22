import React, { useState, useEffect } from "react";
import axios from "axios";
import config from '../config';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [privacyLevel, setPrivacyLevel] = useState(0.5);
  const [message, setMessage] = useState("");
  const [chartData, setChartData] = useState(null);
  
  const handlePrivacyUpdate = async () => {
    try {
      const response = await axios.post(`${config.API_URL}/retrieve-data`, {
        epsilon: privacyLevel,
      });
  
      // Debug response structure
      console.log("Response Data:", response.data);
  
      // Ensure response.data is an array
      if (Array.isArray(response.data.data)) {
        // Extract rows (skip the header row)
        const rows = response.data.data.slice(1);
  
        // Separate names and counts
        const names = rows.map(row => row[0]); // First column
        const counts = rows.map(row => row[1]); // Second column
  
        console.log("Names:", names);
        console.log("Counts:", counts);
  
        // Set chart data
        setChartData({
          labels: names,
          datasets: [
            {
              label: "Loan Purposes",
              data: counts,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
  
        setMessage("Data retrieved successfully!");
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      setMessage("Error: " + (error.response?.data?.message || error.message));
    } finally {
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Loan Purpose'
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Count'
        },
        beginAtZero: true
      }
    }
  };

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (ChartJS.getChart("loanPurposesChart")) {
        ChartJS.getChart("loanPurposesChart").destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 mb-8">
        <h2 className="text-lg font-semibold mb-4">Adjust Privacy Level (Epsilon)</h2>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={privacyLevel}
          onChange={(e) => setPrivacyLevel(parseFloat(e.target.value))}
          className="range range-primary"
        />
        <div className="text-center mt-2">{privacyLevel}</div>
        <button
          onClick={handlePrivacyUpdate}
          className="btn btn-primary w-full mt-4"
        >
          Update Privacy Level
        </button>
      </div>

      {message && (
        <div className="alert alert-info mb-4">
          {message}
        </div>
      )}

      {chartData && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
          <Bar 
            data={chartData} 
            options={chartOptions}
            id="loanPurposesChart"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;