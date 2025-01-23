import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import DebtAnalysisTable from "./DebtAnalysisTable";
import LoanPurposesTable from "./LoanPurposesTable";
import CreditHistoryTable from "./CreditHistoryTable";
import CreditBalanceTable from "./CreditBalanceTable";

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
    const [privacyBudget, setPrivacyBudget] = useState(5); // Varsayýlan privacy budget
    const [sliderValue, setSliderValue] = useState(0.5); // Slider için deðer
    const [loanPurposeTableData, setLoanPurposeTableData] = useState([]);
    const [debtAnalysis, setDebtAnalysis] = useState(null);
    const [creditHistoryData, setCreditHistoryData] = useState(null);
    const [creditBalanceData, setCreditBalanceData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInitialPrivacyBudget = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/get-privacy-budget`);
                setPrivacyBudget(response.data.privacyBudget || 5);
            } catch (error) {
                console.error("Error fetching privacy budget:", error);
            }
        };

        fetchInitialPrivacyBudget();
    }, []);

    const fetchData = async () => {
        try {
            if (privacyBudget <= 0) {
                setMessage("Privacy budget depleted!");
                return;
            }

            setIsLoading(true);
            setMessage("");
            setError(null);

            const budgetResponse = await axios.post(`${config.API_URL}/reduce-privacy-budget`, {
                amount: 1,
            });
            setPrivacyBudget(budgetResponse.data.newPrivacyBudget);

            const loanResponse = await axios.post(`${config.API_URL}/retrieve-loan-purposes-smartnoise`, {
                epsilon: sliderValue,
            });

            if (loanResponse.data && loanResponse.data.result) {
                setLoanPurposeTableData(loanResponse.data.result);
            }

            const debtResponse = await axios.post(`${config.API_URL}/retrieve-debt-analysis`, {
                epsilon: sliderValue,
            });

            if (debtResponse.data && debtResponse.data.data) {
                setDebtAnalysis(debtResponse.data.data);
            }

            const creditHistoryResponse = await axios.post(`${config.API_URL}/retrieve-credit-history`, {
                epsilon: sliderValue,
            });

            if (creditHistoryResponse.data) {
                setCreditHistoryData(creditHistoryResponse.data);
            }

            const creditBalanceResponse = await axios.post(`${config.API_URL}/retrieve-credit-balance`, {
                epsilon: sliderValue,
            });

            if (creditBalanceResponse.data) {
                setCreditBalanceData(creditBalanceResponse.data);
            }

            setMessage("Data retrieved successfully!");
        } catch (error) {
            console.error("Error in fetchData:", error);
            setError(error.response?.data?.message || error.message || "An error occurred while fetching data.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Financial Dashboard</h1>

            {/* Privacy Budget Control Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-lg font-semibold mb-4">Privacy Budget Control</h2>
                <div className="text-center mb-4">
                    <span>Remaining Privacy Budget: </span>
                    <strong>{privacyBudget}</strong>
                </div>

                {/* Slider */}
                <div>
                    <h3 className="text-center mb-2">Adjust Privacy Level</h3>
                    <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={sliderValue}
                        onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                        className="range range-primary w-full"
                    />
                    <div className="text-center mt-2">Selected Privacy Level: {sliderValue}</div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={fetchData}
                        className="btn btn-primary"
                        disabled={isLoading || privacyBudget <= 0}
                    >
                        {isLoading ? "Fetching Data..." : "Retrieve Data"}
                    </button>
                </div>
            </div>

            {/* Message Display */}
            {message && <div className="alert alert-info mb-4">{message}</div>}
            {error && <div className="alert alert-error mb-4">{error}</div>}

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

            {/* Credit History Section */}
            {creditHistoryData && creditHistoryData.data && (
                <CreditHistoryTable data={creditHistoryData} />
            )}

            {/* Credit Balance Analysis Section */}
            {creditBalanceData && creditBalanceData.data && (
                <CreditBalanceTable data={creditBalanceData} />
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
