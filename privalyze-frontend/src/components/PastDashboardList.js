import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const PastDashboardList = () => {
  const [dashboardList, setDashboardList] = useState([]); // Dashboardların listesi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardList = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kullanıcı ID'sini al
      const currentUserResponse = await axios.get(`${config.API_URL}/current-user`);
      const userId = currentUserResponse.data.currentUserId;

      // Kullanıcının tüm dashboardlarını al
      const response = await axios.get(`${config.API_URL}/get-past-dashboards`, {
        params: { userId },
      });

      if (response.data && response.data.pastDashboards) {
        setDashboardList(response.data.pastDashboards);
      } else {
        throw new Error("No dashboards found for the current user.");
      }
    } catch (error) {
      console.error("Error in fetchDashboardList:", error);
      setError(error.response?.data?.message || error.message || "An error occurred while fetching dashboards.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardList();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">My Past Dashboards</h1>

      {isLoading && <div className="loading loading-spinner loading-lg text-center"></div>}
      {error && <div className="alert alert-error text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardList.length > 0 ? (
          dashboardList.map((dashboard) => (
            <div key={dashboard.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Dashboard {dashboard.id}</h3>
              <p className="text-gray-500 mb-4">{new Date(dashboard.created_date).toLocaleString()}</p>
              <button
                className="btn btn-primary w-full"
                onClick={() => navigate(`/past-dashboard/${dashboard.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">No dashboards available.</div>
        )}
      </div>
    </div>
  );
};

export default PastDashboardList;
