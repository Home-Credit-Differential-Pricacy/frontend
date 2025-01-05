import React from "react";

const DataHistory = () => {
  const data = [
    { id: 1, name: "Dataset 1", date: "2025-01-01", status: "Completed" },
    { id: 2, name: "Dataset 2", date: "2025-01-03", status: "In Progress" },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-5">
      <h1 className="text-3xl font-bold mb-4">Data History</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "Completed"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataHistory;
