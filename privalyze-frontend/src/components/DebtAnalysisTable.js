import React, { useState } from 'react';


const DebtAnalysisTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  // Format the raw data into the expected structure
  const formattedData = data?.data?.map((item) => ({
    SK_ID_CURR: item.SK_ID_CURR,
    noisy_debt_to_income_ratio: item.noisy_debt_to_income_ratio,
  })) || [];

  console.log("Formatted Data:", formattedData);

  if (!formattedData || !Array.isArray(formattedData) || formattedData.length === 0) {
    return <div className="p-4">No debt analysis data available</div>;
  }

  // Sort the data based on the selected column and direction
  const sortedData = [...formattedData].sort((a, b) => {
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

  return (
    <div className="flex gap-4">
      {/* Scrollable Table */}
      <div className="overflow-x-auto overflow-y-scroll max-h-96 bg-white shadow-lg rounded-lg w-1/2 p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th
                className="cursor-pointer hover:bg-base-200"
                onClick={() => requestSort('SK_ID_CURR')}
              >
                Customer ID {sortConfig.key === 'SK_ID_CURR' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
              <th
                className="cursor-pointer hover:bg-base-200"
                onClick={() => requestSort('noisy_debt_to_income_ratio')}
              >
                Debt to Income Ratio {sortConfig.key === 'noisy_debt_to_income_ratio' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index} className="hover">
                <td>{row.SK_ID_CURR}</td>
                <td>{row.noisy_debt_to_income_ratio.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebtAnalysisTable;