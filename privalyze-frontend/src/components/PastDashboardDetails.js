import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../config";
import DebtAnalysisTable from "./DebtAnalysisTable";
import LoanPurposesTable from "./LoanPurposesTable";
import CreditHistoryTable from "./CreditHistoryTable";
import CreditBalanceTable from "./CreditBalanceTable";
import ApplicationStatusTable from "./ApplicationStatusTable";
import EducationIncomeTable from "./EducationIncomeTable";

const PastDashboardDetails = () => {
  const { id } = useParams(); // URL'den dashboard ID'sini al
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Dashboard verisini al
      const response = await axios.get(`${config.API_URL}/get-dashboard-details`, {
        params: { id },
      });
      console.log(response.data.dashboard);
      if (response.data && response.data.dashboard) {
        setDashboardData(response.data.dashboard);
      } else {
        throw new Error("Dashboard not found.");
      }
    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
      setError(error.response?.data?.message || error.message || "An error occurred while fetching dashboard details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [id]);

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard Details</h1>

      {isLoading && <div className="loading loading-spinner loading-lg text-center"></div>}
      {error && <div className="alert alert-error text-center">{error}</div>}

      {dashboardData && (
        <>
          {/* Education Income */}
          {dashboardData.education_income && (
            <div className="mb-4">
              <EducationIncomeTable data={dashboardData.education_income} />
            </div>
          )}

          {/* Credit History */}
          {dashboardData.credit_history && (
            <div className="mb-4">
              <CreditHistoryTable data={dashboardData.credit_history} />
            </div>
          )}

          {/* Credit Balance */}
          {dashboardData.credit_balance && (
            <div className="mb-4">
              <CreditBalanceTable data={dashboardData.credit_balance} />
            </div>
          )}

          {/* Loan Purposes */}
          {dashboardData.loan_purposes && (
            <div className="mb-4">
              <LoanPurposesTable data={dashboardData.loan_purposes} />
            </div>
          )}

          {/* Debt Analysis */}
          {dashboardData.debt_analysis && (
            <div className="mb-4">
              <DebtAnalysisTable data={dashboardData.debt_analysis} />
            </div>
          )}

          {/* Application Status */}
          {dashboardData.application_status && (
            <div className="mb-4">
              <ApplicationStatusTable data={dashboardData.application_status} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PastDashboardDetails;
