import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import { Bar } from "react-chartjs-2";
import DebtAnalysisTable from "./DebtAnalysisTable";
import LoanPurposesTable from "./LoanPurposesTable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [privacyLevel, setPrivacyLevel] = useState(0.5);
  const [message, setMessage] = useState("");
  const [loanPurposeData, setLoanPurposeData] = useState(null);
  const [loanPurposeTableData, setLoanPurposeTableData] = useState([]); // Added for table
  const [debtAnalysis, setDebtAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      setError(null);

      // Fetch Loan Purposes Distribution
      const loanResponse = await axios.post(`${config.API_URL}/retrieve-loan-purposes`, {
        epsilon: privacyLevel,
      });

      if (loanResponse.data && loanResponse.data.data) {
        // Extract loan purposes and counts for chart and table
        console.log(loanResponse.data);
        const validData = loanResponse.data.data.filter(
          (item) => item[0] !== "NAME_CASH_LOAN_PURPOSE" && item[1] !== undefined
        );  
        const loanPurposes = validData.map((item) => item[0]);
        const counts = validData.map((item) => item[1]);  
        console.log(loanPurposes);
        console.log(counts);

        setLoanPurposeData({
          labels: loanPurposes,
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

        setLoanPurposeTableData(loanResponse.data.data); // For the table
      }

      // Fetch Debt Analysis
      const debtResponse = await axios.post(`${config.API_URL}/retrieve-debt-analysis`, {
        epsilon: privacyLevel,
      });

      console.log(debtResponse.data.data);

      if (debtResponse.data && debtResponse.data.data) {
        setDebtAnalysis(debtResponse.data.data);
      }

      setMessage("Data retrieved successfully!");
    } catch (error) {
      setError(error.message || "An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Financial Dashboard</h1>

      {/* Privacy Control Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Privacy Level Control</h2>

        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={privacyLevel}
          onChange={(e) => setPrivacyLevel(parseFloat(e.target.value))}
          className="range range-primary w-full"
        />
        <div className="text-center mt-2">Epsilon: {privacyLevel}</div>
        <div className="flex justify-center mt-4">
          <button
            onClick={fetchData}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Fetching Data..." : "Retrieve Data"}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && <div className="alert alert-info mb-4">{message}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Loan Purposes Section */}
      {loanPurposeData && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Loan Purposes Distribution</h2>
            {/* Chart */}
            <div className="chart-container">
              <Bar data={loanPurposeData} options={{ responsive: true }} />
          </div>
        </div>
      )}

      {/* Debt Analysis Section */}
      {debtAnalysis && (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Debt Analysis</h2>
          <div className="w-full overflow-auto max-h-96">
            <DebtAnalysisTable data={debtAnalysis} />
          </div>
        </div>
      )}

        {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;

