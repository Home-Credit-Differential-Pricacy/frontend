import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [privacyLevel, setPrivacyLevel] = useState(0.5); // Varsayılan gizlilik seviyesi
  const [message, setMessage] = useState(""); // Mesaj için state

  const handlePrivacyUpdate = async () => {
    try {
      // Backend'e yeni gizlilik seviyesini gönder
      await axios.post("http://localhost:5000/set-privacy-level", {
        epsilon: privacyLevel,
      });
      setMessage("Privacy level updated successfully!"); // Başarılı mesaj
      setTimeout(() => setMessage(""), 3000); // Mesajı 3 saniye sonra temizle
    } catch (error) {
      setMessage("Error updating privacy level: " + error.message); // Hata mesajı
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      {/* Dashboard Başlık */}
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {/* Slider ve Gizlilik Seviyesi */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Adjust Privacy Level (Epsilon)
        </h2>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={privacyLevel}
          className="slider w-full"
          onChange={(e) => setPrivacyLevel(parseFloat(e.target.value))}
        />
        <p className="text-center mt-2">
          Selected Privacy Level:{" "}
          <span className="font-bold text-primary">{privacyLevel}</span>
        </p>
        <button
          onClick={handlePrivacyUpdate}
          className="btn btn-primary mt-4 w-full"
        >
          Update Privacy Level
        </button>
        {message && <p className="text-center mt-4 text-green-500">{message}</p>}
      </div>

      {/* Dashboard İçeriği */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Your Data Summary</h2>
        <p>Total Queries: <span className="font-bold text-primary">12</span></p>
        <p>Remaining Privacy Budget: <span className="font-bold text-secondary">75%</span></p>
        <p>Last Query: <span className="font-bold">2025-01-05</span></p>
      </div>
    </div>
  );
};

export default Dashboard;
