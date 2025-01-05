import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n"; // i18n yapılandırması
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import DataHistory from "./components/DataHistory";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile"; // Profil bileşeni
import TwoFactorAuth from "./components/TwoFactorAuth"; // İki faktörlü giriş
import ForgotPassword from "./components/ForgotPassword"; // Şifre sıfırlama

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı oturum durumu
  const [theme, setTheme] = useState("light"); // Varsayılan tema
  const { t, i18n } = useTranslation();

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Dil değiştirme fonksiyonu
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  // Sayfa yüklendiğinde kaydedilen temayı uygula
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <Router>
      {/* Navbar */}
      <div className="navbar bg-primary text-white shadow-lg">
  <div className="flex-1">
    <img
      src="/logo.png"
      alt="Privalyze Logo"
      className="h-12 w-12 rounded-full mr-3 shadow-lg hover:scale-110 transition-transform"
    />
    <Link to="/" className="btn btn-ghost normal-case text-xl">
      Privalyze
    </Link>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      {!isAuthenticated ? (
        <>
          <li>
            <Link to="/">{t("signin")}</Link>
          </li>
          <li>
            <Link to="/signup">{t("signup")}</Link>
          </li>
          <li>
            <Link to="/forgot-password">{t("forgot_password")}</Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/data-history">{t("data_history")}</Link>
          </li>
          <li>
            <Link to="/dashboard">{t("dashboard")}</Link>
          </li>
          <li>
            <Link to="/profile">{t("profile")}</Link>
          </li>
          <li>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn btn-secondary text-white"
            >
              {t("logout")}
            </button>
          </li>
        </>
      )}
      <li>
        <button
          onClick={toggleTheme}
          className="btn btn-outline btn-accent"
        >
          {theme === "light" ? t("dark_mode") : t("light_mode")}
        </button>
      </li>
      {/* Language Dropdown */}
      <li className="dropdown dropdown-hover">
        <label tabIndex={0} className="btn btn-outline btn-accent">
          {t("language")}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <button onClick={() => changeLanguage("en")}>English</button>
          </li>
          <li>
            <button onClick={() => changeLanguage("tr")}>Türkçe</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</div>


      {/* Route'lar */}
      <Routes>
        <Route
          path="/"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/data-history"
          element={
            isAuthenticated ? (
              <DataHistory />
            ) : (
              <div className="text-center text-xl mt-10 text-error">
                {t("sign_in_to_view")}
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
                {t("sign_in_to_view")}
              </div>
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile />
            ) : (
              <div className="text-center text-xl mt-10 text-error">
                {t("sign_in_to_view")}
              </div>
            )
          }
        />
        <Route
          path="/two-factor-auth"
          element={
            isAuthenticated ? (
              <TwoFactorAuth />
            ) : (
              <div className="text-center text-xl mt-10 text-error">
                {t("sign_in_to_view")}
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
