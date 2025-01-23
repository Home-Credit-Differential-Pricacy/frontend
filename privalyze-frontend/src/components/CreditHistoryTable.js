import React, { useState } from "react";
import axios from "axios";
import config from '../config';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CreditHistoryTable = ({ data }) => {
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // console.log("Credit History Data received:", data);

  // Access the deeply nested data array
  const creditData = data?.data?.data || [];

  // Validate data structure
  if (!Array.isArray(creditData) || creditData.length === 0) {
    console.error("Invalid or empty data format received:", data);
    return <div className="alert alert-error">No credit history data available</div>;
  }

  // Sort the data based on the selected column and direction
  const sortedData = [...creditData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = parseFloat(a[sortConfig.key]) || 0;
    const bValue = parseFloat(b[sortConfig.key]) || 0;

    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
  });

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Active Credits', 'Closed Credits', 'Average Debt',
      'Noisy Active Credits', 'Noisy Closed Credits', 'Noisy Average Debt'
    ];
    
    const csvData = sortedData.map(row => [
      row.active_credits || 0,
      row.closed_credits || 0,
      row.avg_debt || 0,
      row.noisy_active_credits || 0,
      row.noisy_closed_credits || 0,
      row.noisy_avg_debt || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'credit_history_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = {
    labels: sortedData.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: 'Average Debt',
        data: sortedData.map(item => item.avg_debt || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Noisy Average Debt',
        data: sortedData.map(item => item.noisy_avg_debt || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Calculate averages
  const calculateAverages = () => {
    const activeAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_active_credits || 0), 0) / sortedData.length;
    const closedAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_closed_credits || 0), 0) / sortedData.length;
    const debtAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_avg_debt || 0), 0) / sortedData.length;
    
    return {
      activeAvg: activeAvg.toFixed(2),
      closedAvg: closedAvg.toFixed(2),
      debtAvg: debtAvg.toFixed(2)
    };
  };

  const averages = calculateAverages();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8 mt-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Credit History</h2>
        <button
          onClick={exportToCSV}
          className="btn btn-primary btn-sm"
        >
          Export to CSV
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-4 w-full mb-6">
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Active Credits</div>
          <div className="stat-value text-primary">{averages.activeAvg}</div>
          <div className="stat-desc">Average noisy active credits</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Closed Credits</div>
          <div className="stat-value text-secondary">{averages.closedAvg}</div>
          <div className="stat-desc">Average noisy closed credits</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Debt</div>
          <div className="stat-value text-accent">{averages.debtAvg}</div>
          <div className="stat-desc">Average noisy debt amount</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Chart - Now Larger */}
        <div className="w-full md:w-2/3 p-4 max-h-96">
          <h2>Average Debt Distribution</h2>
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              height: 400
            }}
          />
        </div>

        {/* Scrollable Table - Now Smaller */}
        <div className="w-full md:w-1/3 overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('active_credits')}
                >
                  Active Credits {sortConfig.key === 'active_credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('closed_credits')}
                >
                  Closed Credits {sortConfig.key === 'closed_credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('avg_debt')}
                >
                  Average Debt {sortConfig.key === 'avg_debt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_active_credits')}
                >
                  Noisy Active Credits {sortConfig.key === 'noisy_active_credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_closed_credits')}
                >
                  Noisy Closed Credits {sortConfig.key === 'noisy_closed_credits' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_avg_debt')}
                >
                  Noisy Average Debt {sortConfig.key === 'noisy_avg_debt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sortedData) && sortedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.active_credits || 0}</td>
                  <td>{row.closed_credits || 0}</td>
                  <td>{(row.avg_debt || 0).toFixed(2)}</td>
                  <td>{(row.noisy_active_credits || 0).toFixed(2)}</td>
                  <td>{(row.noisy_closed_credits || 0).toFixed(2)}</td>
                  <td>{(row.noisy_avg_debt || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditHistoryTable;