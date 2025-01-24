// src/components/LoanPurposesTable.js
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const LoanPurposesTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // Transform data into objects, skipping the header row
  const formattedData = data?.slice(1).map(row => ({
    NAME_CASH_LOAN_PURPOSE: row[0],
    purpose_count: parseInt(row[1])
  })) || [];

  if (formattedData.length === 0) {
    return <div className="alert alert-error">No loan purposes data available</div>;
  }

  // Sort the data
  const sortedData = [...formattedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (sortConfig.key === 'NAME_CASH_LOAN_PURPOSE') {
      return sortConfig.direction === 'ascending' 
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    }
    return sortConfig.direction === 'ascending' 
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' 
        ? 'descending' 
        : 'ascending',
    });
  };

  const exportToCSV = () => {
    const headers = ['Loan Purpose', 'Purpose Count'];
    
    const csvData = sortedData.map(row => [
      row.NAME_CASH_LOAN_PURPOSE,
      row.purpose_count
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'loan_purposes_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = {
    labels: formattedData.map(item => item.NAME_CASH_LOAN_PURPOSE),
    datasets: [
      {
        label: 'Purpose Count',
        data: formattedData.map(item => item.purpose_count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8 mt-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Loan Purpose Distribution</h2>
        <button
          onClick={exportToCSV}
          className="btn btn-primary btn-sm"
        >
          Export to CSV
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Scrollable Table */}
        <div className="w-full md:w-1/2 overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('NAME_CASH_LOAN_PURPOSE')}
                >
                  Loan Purpose {sortConfig.key === 'NAME_CASH_LOAN_PURPOSE' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('purpose_count')}
                >
                  Purpose Count {sortConfig.key === 'purpose_count' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index} className="hover">
                  <td>{row.NAME_CASH_LOAN_PURPOSE}</td>
                  <td>{row.purpose_count !== undefined ? row.purpose_count.toFixed(2) : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Chart */}
        <div className="w-full md:w-1/2 p-4 max-h-96">
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default LoanPurposesTable;