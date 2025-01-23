import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to parse string data
const parseData = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing data:", e);
      return null;
    }
  }
  return data;
};

const ApplicationStatusTable = ({ data }) => {
//   console.log("Raw data in ApplicationStatusTable:");
//   console.log(data);

  // Use the helper function to parse data
  const parsedData = parseData(data);

  if (!parsedData || !parsedData.data) {
    console.log("Missing or invalid data structure:", parsedData);
    return <div>No application status data available</div>;
  }

  const resultData = parsedData.data;
//   console.log("Application Status Data received:", resultData);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Application Status Distribution' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const chartData = {
    labels: resultData.map((_, index) => `Customer ${index + 1}`),
    datasets: [{
      label: 'Approved',
      data: resultData.map(item => item.noisy_approved_applications || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }, {
      label: 'Refused',
      data: resultData.map(item => item.noisy_refused_applications || 0),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    }]
  };

  const aggregateStats = {
    totalCustomers: resultData.length,
    avgApprovalRate: (resultData.reduce((sum, item) => sum + (item.noisy_approval_rate || 0), 0) / (resultData.length || 1) * 100).toFixed(1),
    totalApplications: resultData.reduce((sum, item) => 
      sum + (item.noisy_approved_applications || 0) + (item.noisy_refused_applications || 0), 0)
  };

  const exportToCSV = () => {
    const headers = ['Total Applications', 'Approved', 'Refused', 'Approval Rate'];
    
    const csvData = resultData.map(row => [
      Math.round(row.noisy_approved_applications + row.noisy_refused_applications),
      Math.round(row.noisy_approved_applications || 0),
      Math.round(row.noisy_refused_applications || 0),
      ((row.noisy_approval_rate || 0) * 100).toFixed(1)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'application_status_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Application Status Analysis</h2>
        <button
          onClick={exportToCSV}
          className="btn btn-primary btn-sm"
        >
          Export to CSV
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat bg-base-100 rounded-lg shadow p-2">
                <div className="stat-title">Total Customers</div>
                <div className="stat-value text-primary">{aggregateStats.totalCustomers}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow p-2">
                <div className="stat-title">Average Approval Rate</div>
                <div className="stat-value text-secondary">{aggregateStats.avgApprovalRate}%</div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow p-2">
                <div className="stat-title">Total Applications</div>
                <div className="stat-value text-accent">{Math.round(aggregateStats.totalApplications)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Total Applications</th>
                <th className="px-4 py-2">Approved</th>
                <th className="px-4 py-2">Refused</th>
                <th className="px-4 py-2">Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {resultData.slice(0, 100).map((item) => (
                <tr key={item.customer_id} className="border-b">
                  <td className="px-4 py-2">{Math.round(item.noisy_approved_applications + item.noisy_refused_applications)}</td>
                  <td className="px-4 py-2">{Math.round(item.noisy_approved_applications || 0)}</td>
                  <td className="px-4 py-2">{Math.round(item.noisy_refused_applications || 0)}</td>
                  <td className="px-4 py-2">{((item.noisy_approval_rate || 0) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {resultData.length > 100 && (
            <p className="text-sm text-gray-500 mt-2">Showing first 100 records</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusTable;