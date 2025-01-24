import React, { useState } from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EducationIncomeTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  console.log("Education Inside");
  console.log(data);

  let educationData = [];

  if (data && Array.isArray(data.data)) {
    educationData = data.data;
  } else if (data && data.data && Array.isArray(data.data.data)) {
    educationData = data.data.data;
  } else {
    educationData = data || [];
  }

  if (!Array.isArray(educationData) || educationData.length === 0) {
    return <div className="alert alert-error">No education income data available</div>;
  }

  const sortedData = [...educationData].sort((a, b) => {
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

  const chartData = {
    labels: sortedData.map((_, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: 'Average Credit Amount',
        data: sortedData.map(item => item.avg_credit_amount || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Noisy Average Credit Amount',
        data: sortedData.map(item => item.noisy_avg_credit_amount || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const calculateAverageIncome = (educationLevel) => {
    const filteredData = sortedData.filter(item => item.education_level === educationLevel);
    const totalIncome = filteredData.reduce((acc, curr) => acc + (curr.noisy_avg_income || 0), 0);
    return (totalIncome / filteredData.length).toFixed(2);
  };

  const averageIncomeSecondary = calculateAverageIncome("Secondary / secondary special");
  const averageIncomeLowerSecondary = calculateAverageIncome("Lower secondary");
  const averageIncomeHigher = calculateAverageIncome("Higher education");
  const averageIncomeIncompleteHigher = calculateAverageIncome("Incomplete higher");

  const exportToCSV = () => {
    const headers = [
      'Education Level', 'Income Type', 'Average Credit Amount', 'Noisy Average Credit Amount',
      'Average Income', 'Noisy Average Income', 'Default Rate', 'Noisy Default Rate'
    ];

    const csvData = sortedData.map(row => [
      row.education_level,
      row.income_type,
      row.avg_credit_amount || 0,
      row.noisy_avg_credit_amount || 0,
      row.avg_income || 0,
      row.noisy_avg_income || 0,
      row.default_rate || 0,
      row.noisy_default_rate || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'education_income_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8 mt-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Education and Income Analysis</h2>
        <button
          onClick={exportToCSV}
          className="btn btn-primary btn-sm"
        >
          Export to CSV
        </button>
      </div>

      {/* Informative Cards */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Income (Secondary)</div>
          <div className="stat-value text-primary">{averageIncomeSecondary}</div>
          <div className="stat-desc">Noisy average income for Secondary / secondary special</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Income (Lower Secondary)</div>
          <div className="stat-value text-secondary">{averageIncomeLowerSecondary}</div>
          <div className="stat-desc">Noisy average income for Lower secondary</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Income (Higher)</div>
          <div className="stat-value text-accent">{averageIncomeHigher}</div>
          <div className="stat-desc">Noisy average income for Higher education</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Average Income (Incomplete Higher)</div>
          <div className="stat-value text-info">{averageIncomeIncompleteHigher}</div>
          <div className="stat-desc">Noisy average income for Incomplete higher</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Chart */}
        <div className="w-full md:w-2/3 p-4 max-h-96">
          <h2>Average Credit Amount Distribution</h2>
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              height: 400
            }}
          />
        </div>

        {/* Scrollable Table */}
        <div className="w-full md:w-1/3 overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg p-4">
          <table className="table w-full">
            <thead>
              <tr>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('education_level')}
                >
                  Education Level {sortConfig.key === 'education_level' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('income_type')}
                >
                  Income Type {sortConfig.key === 'income_type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('avg_credit_amount')}
                >
                  Average Credit Amount {sortConfig.key === 'avg_credit_amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_avg_credit_amount')}
                >
                  Noisy Average Credit Amount {sortConfig.key === 'noisy_avg_credit_amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('avg_income')}
                >
                  Average Income {sortConfig.key === 'avg_income' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_avg_income')}
                >
                  Noisy Average Income {sortConfig.key === 'noisy_avg_income' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('default_rate')}
                >
                  Default Rate {sortConfig.key === 'default_rate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th
                  className="cursor-pointer hover:bg-base-200"
                  onClick={() => requestSort('noisy_default_rate')}
                >
                  Noisy Default Rate {sortConfig.key === 'noisy_default_rate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.education_level}</td>
                  <td>{row.income_type}</td>
                  <td>{(row.avg_credit_amount || 0).toFixed(2)}</td>
                  <td>{(row.noisy_avg_credit_amount || 0).toFixed(2)}</td>
                  <td>{(row.avg_income || 0).toFixed(2)}</td>
                  <td>{(row.noisy_avg_income || 0).toFixed(2)}</td>
                  <td>{(row.default_rate || 0).toFixed(2)}</td>
                  <td>{(row.noisy_default_rate || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EducationIncomeTable;