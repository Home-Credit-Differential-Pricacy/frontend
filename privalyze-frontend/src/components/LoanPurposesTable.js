// src/components/LoanPurposesTable.js
import React, { useState } from 'react';

const LoanPurposesTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  if (!data || !Array.isArray(data)) {
    return <div className="p-4">No loan purposes data available</div>;
  }

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

  return (
    <div className="overflow-x-auto">
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
              Count {sortConfig.key === 'purpose_count' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <tr key={index} className="hover">
              <td>{row.NAME_CASH_LOAN_PURPOSE || 'Unknown'}</td>
              <td>{row.purpose_count || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanPurposesTable;