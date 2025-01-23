import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import DebtAnalysisTable from "./DebtAnalysisTable";
import LoanPurposesTable from "./LoanPurposesTable";
import CreditHistoryTable from "./CreditHistoryTable";
import CreditBalanceTable from "./CreditBalanceTable";
import ApplicationStatusTable from './ApplicationStatusTable';
import EducationIncomeTable from "./EducationIncomeTable"; // Import the new component

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
  const [loanPurposeTableData, setLoanPurposeTableData] = useState([]); // Updated for table
  const [debtAnalysis, setDebtAnalysis] = useState(null);
  const [creditHistoryData, setCreditHistoryData] = useState(null); // Add state for credit history data
  const [creditBalanceData, setCreditBalanceData] = useState(null);
  const [applicationStatusData, setApplicationStatusData] = useState(null);
  const [educationIncomeData, setEducationIncomeData] = useState(null); // Add state for education and income data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      setError(null);

      // Fetch Loan Purposes Distribution
      const loanResponse = await axios.post(`${config.API_URL}/retrieve-loan-purposes-smartnoise`, {
        epsilon: privacyLevel,
      });


      if (loanResponse.data && loanResponse.data.result) {
        setLoanPurposeTableData(loanResponse.data.result);
      }

      // Fetch Debt Analysis
      const debtResponse = await axios.post(`${config.API_URL}/retrieve-debt-analysis`, {
        epsilon: privacyLevel,
      });


      if (debtResponse.data && debtResponse.data.data) {
        setDebtAnalysis(debtResponse.data.data);
      }

      // Fetch Credit History
      const creditHistoryResponse = await axios.post(`${config.API_URL}/retrieve-credit-history`, {
        epsilon: privacyLevel,
      });

      if (creditHistoryResponse.data) {
        setCreditHistoryData(creditHistoryResponse.data);
      } else {
        console.error("Invalid credit history data format:", creditHistoryResponse.data);
        setError("Invalid credit history data format received");
      }

      // Fetch Credit Balance Analysis
      const creditBalanceResponse = await axios.post(`${config.API_URL}/retrieve-credit-balance`, {
        epsilon: privacyLevel,
      });

      if (creditBalanceResponse.data) {
        setCreditBalanceData(creditBalanceResponse.data);
      }

      // Fetch Application Status with error handling
      const applicationStatusResponse = await axios.post(
        `${config.API_URL}/retrieve-application-status`,
        { epsilon: privacyLevel }
      );

      
      if (applicationStatusResponse.data ) {
        setApplicationStatusData(applicationStatusResponse.data);
      } else {
        console.error("Invalid application status data:", applicationStatusResponse);
        setError("Invalid application status data format received");
      }

      // Fetch Education and Income Analysis
      const educationIncomeResponse = await axios.post(`${config.API_URL}/retrieve-education-income-analysis`, {
        epsilon: privacyLevel,
      });

      if (educationIncomeResponse.data) {
        setEducationIncomeData(educationIncomeResponse.data);
      }

      setMessage("Data retrieved successfully!");
    } catch (error) {
      console.error("Error in fetchData:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An error occurred while fetching data."
      );
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
      
      {/* Education and Income Analysis Section */}
      {educationIncomeData && (
        <EducationIncomeTable data={educationIncomeData} />
      )}

            {/* Credit History Section */}
            {creditHistoryData && creditHistoryData.data && (
        <CreditHistoryTable data={creditHistoryData} />
      )}

      {/* Credit Balance Analysis Section */}
      {creditBalanceData && creditBalanceData.data && (
        <CreditBalanceTable data={creditBalanceData} />
      )}

      {/* Loan Purposes Section */}
      {loanPurposeTableData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">Loan Purposes Distribution</h2>
          <LoanPurposesTable data={loanPurposeTableData} />
        </div>
      )}

      {/* Debt Analysis Section */}
      {debtAnalysis && (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8">
          <h2 className="text-lg font-semibold mb-4">Debt Analysis</h2>
          <div className="w-full overflow-auto max-h-120">
            <DebtAnalysisTable data={debtAnalysis} />
          </div>
        </div>
      )}

      {/* Application Status Section */}
      {applicationStatusData && (
        <ApplicationStatusTable data={applicationStatusData} />
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

