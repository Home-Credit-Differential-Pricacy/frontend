import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import DataHistory from "./components/DataHistory";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı oturum durumu

  return (
    <Router>
      {/* Navbar */}
      <div className="navbar bg-primary text-white">
  <div className="flex-1">
    {/* Logo ve metin */}
    <img
      src="/logo.png"
      alt="Privalyze Logo"
      className="h-12 w-12 rounded-full mr-3 shadow-lg hover:scale-110 transition-transform"
    />
    <a className="btn btn-ghost normal-case text-xl">Privalyze</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      {!isAuthenticated ? (
        <>
          <li>
            <Link to="/">Sign In</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/data-history">Data History</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn btn-secondary text-white"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  </div>
</div>




      {/* Route'lar */}
      <Routes>
        <Route path="/" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/data-history"
          element={
            isAuthenticated ? (
              <DataHistory />
            ) : (
              <div className="text-center text-xl mt-10 text-error">
                You need to sign in to view this page.
              </div>
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <div className="text-center text-xl mt-10 text-error">
                You need to sign in to view this page.
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
