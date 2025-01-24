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

const privacyLevels = [
  { value: 0.1, label: "Very High Privacy", description: "Lowest accuracy, highest privacy", icon: "🔒" },
  { value: 0.3, label: "High Privacy", description: "Low accuracy, high privacy", icon: "🔐" },
  { value: 0.5, label: "Balanced", description: "Balanced accuracy and privacy", icon: "⚖️" },
  { value: 0.7, label: "High Accuracy", description: "High accuracy, low privacy", icon: "🔍" },
  { value: 1.0, label: "Very High Accuracy", description: "Highest accuracy, lowest privacy", icon: "📈" },
];

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

      // Kullanıcı ID'sini al
      const currentUserResponse = await axios.get(`${config.API_URL}/current-user`);
      const userId = currentUserResponse.data.currentUserId;
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

      const allData = {
        loanPurposes: loanResponse.data.result || [],
        debtAnalysis: debtResponse.data.data || [],
        creditHistory: creditHistoryResponse.data.data || [],
        creditBalance: creditBalanceResponse.data.data || [],
        applicationStatus: applicationStatusResponse.data.data || [],
        educationIncome: educationIncomeResponse.data.data || [],
      };
      // Kullanıcı ID'si ile veriyi birleştirme
    const userDataToSave = {
      userId,
      ...allData,
    };

    // JSON olarak kaydetme (backend'e)
    await axios.post(`${config.API_URL}/save-dashboard-data`, userDataToSave);

    setMessage("Data retrieved and saved successfully!");
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

        <div className="grid grid-cols-5 gap-4 mb-4">
          {privacyLevels.map(level => (
            <div
              key={level.value}
              className={`p-4 rounded-lg shadow cursor-pointer transition-transform transform hover:scale-105 ${privacyLevel === level.value ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setPrivacyLevel(level.value)}
            >
              <div className="text-2xl">{level.icon}</div>
              <div className="text-sm font-semibold">{level.label}</div>
              <div className="text-xs">{level.description}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-2">Selected Epsilon: {privacyLevel}</div>
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

