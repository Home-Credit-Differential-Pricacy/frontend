import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const DebtAnalysisTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // console.log("Debt Analysis inside");
  // console.log(data);

  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="p-4">No debt analysis data available</div>;
  }

  // Sort the data based on the selected column and direction
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
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
    const headers = ['Noisy Debt to Income Ratio', 'Original Debt to Income Ratio'];
    
    const csvData = sortedData.map(row => [
      row.noisy_debt_to_income_ratio || 0,
      row.debt_to_income_ratio || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'debt_analysis_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate averages
  const calculateAverages = () => {
    const noisyAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_debt_to_income_ratio || 0), 0) / sortedData.length;
    const originalAvg = sortedData.reduce((acc, curr) => acc + (curr.debt_to_income_ratio || 0), 0) / sortedData.length;
    return {
      noisyAvg: noisyAvg.toFixed(2),
      originalAvg: originalAvg.toFixed(2),
      difference: (noisyAvg - originalAvg).toFixed(2)
    };
  };

  const averages = calculateAverages();

  const chartData = {
    labels: data.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: 'Debt to Income Ratio',
        data: data.map(item => item.debt_to_income_ratio),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Noisy Debt to Income Ratio',
        data: data.map(item => item.noisy_debt_to_income_ratio),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Debt Analysis</h2>
        <button
          onClick={exportToCSV}
          className="btn btn-primary btn-sm"
        >
          Export to CSV
        </button>
      </div>

      {/* Analytics Card */}
      <div className="w-full mb-6">
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Noisy Debt Ratio</div>
          <div className="stat-value text-primary">{averages.noisyAvg}%</div>
          <div className="stat-desc">Original: {averages.originalAvg}%</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-h-96">
        {/* Chart - Now Larger */}
        <div className="w-full md:w-2/3 p-4">
          <h2>Debt to Income Ratio Distribution</h2>
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
                  onClick={() => requestSort('noisy_debt_to_income_ratio')}
                >
                  Noisy Debt to Income Ratio {sortConfig.key === 'noisy_debt_to_income_ratio' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('debt_to_income_ratio')}
                >
                  Original Debt to Income Ratio {sortConfig.key === 'debt_to_income_ratio' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index} className="hover">
                  <td>{row.noisy_debt_to_income_ratio !== undefined ? row.noisy_debt_to_income_ratio.toFixed(2) : 'N/A'}%</td>
                  <td>{row.debt_to_income_ratio !== undefined ? row.debt_to_income_ratio.toFixed(2) : 'N/A'}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DebtAnalysisTable;