import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CreditBalanceTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const creditData = data?.data?.data || data?.data || [];

  if (!Array.isArray(creditData) || creditData.length === 0) {
    return <div className="alert alert-error">No credit balance data available</div>;
  }

  const sortedData = [...creditData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = parseFloat(a[sortConfig.key]) || 0;
    const bValue = parseFloat(b[sortConfig.key]) || 0;
    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
  });

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Credit Amount', 'Income', 
      'Noisy Credit', 'Noisy Income', 'Noisy Annuity', 'Noisy Balance'
    ];
    
    const csvData = sortedData.map(row => [
      row.credit || 0,
      row.income || 0,
      row.noisy_credit || 0,
      row.noisy_income || 0,
      row.noisy_annuity || 0,
      row.noisy_balance || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'credit_balance_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = {
    labels: sortedData.map((_, index) => `Customer ${index + 1}`),
    datasets: [
      {
        label: 'Credit Amount',
        data: sortedData.map(item => item.credit || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Noisy Credit Amount',
        data: sortedData.map(item => item.noisy_credit || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Calculate averages
  const calculateAverages = () => {
    const creditAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_credit || 0), 0) / sortedData.length;
    const incomeAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_income || 0), 0) / sortedData.length;
    const balanceAvg = sortedData.reduce((acc, curr) => acc + (curr.noisy_balance || 0), 0) / sortedData.length;
    
    return {
      creditAvg: creditAvg.toFixed(2),
      incomeAvg: incomeAvg.toFixed(2),
      balanceAvg: balanceAvg.toFixed(2)
    };
  };

  const averages = calculateAverages();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Credit Balance Analysis</h2>
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
          <div className="stat-title">Credit Amount</div>
          <div className="stat-value text-primary">{averages.creditAvg}</div>
          <div className="stat-desc">Average noisy credit</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Income</div>
          <div className="stat-value text-secondary">{averages.incomeAvg}</div>
          <div className="stat-desc">Average noisy income</div>
        </div>
        <div className="stat bg-base-100 rounded-lg shadow p-4">
          <div className="stat-title">Balance</div>
          <div className="stat-value text-accent">{averages.balanceAvg}</div>
          <div className="stat-desc">Average noisy balance</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Chart - Now Larger */}
        <div className="w-full md:w-2/3 p-4 max-h-96">
          <h2>Credit Distribution</h2>
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
                <th colSpan="2" className="text-center">Original Data</th>
                <th colSpan="4" className="text-center">Noisy Data</th>
              </tr>
              <tr>
                <th onClick={() => requestSort('credit')}>
                  Credit Amount {sortConfig.key === 'credit' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('income')}>
                  Income {sortConfig.key === 'income' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('noisy_credit')}>
                  Noisy Credit {sortConfig.key === 'noisy_credit' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('noisy_income')}>
                  Noisy Income {sortConfig.key === 'noisy_income' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('noisy_annuity')}>
                  Noisy Annuity {sortConfig.key === 'noisy_annuity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('noisy_balance')}>
                  Noisy Balance {sortConfig.key === 'noisy_balance' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={index}>
                  <td>{(row.credit || 0).toFixed(2)}</td>
                  <td>{(row.income || 0).toFixed(2)}</td>
                  <td>{(row.noisy_credit || 0).toFixed(2)}</td>
                  <td>{(row.noisy_income || 0).toFixed(2)}</td>
                  <td>{(row.noisy_annuity || 0).toFixed(2)}</td>
                  <td>{(row.noisy_balance || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditBalanceTable;