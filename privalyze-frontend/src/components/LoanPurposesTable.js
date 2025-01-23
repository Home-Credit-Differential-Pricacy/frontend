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
    return <div className="p-4">No loan purposes data available</div>;
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
    <div className="flex gap-4">
      {/* Scrollable Table */}
      <div className="overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg w-1/2 p-4">
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
      <div className="w-1/2 p-4">
        <h2>Loan Purpose Distribution</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default LoanPurposesTable;