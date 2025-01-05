import React, { useState } from "react";

const PasswordStrength = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);

  const getStrengthColor = () => {
    if (strength < 2) return "bg-red-500"; // Weak
    if (strength === 2 || strength === 3) return "bg-yellow-500"; // Moderate
    if (strength > 3) return "bg-green-500"; // Strong
  };

  return (
    <div className="w-full mt-2">
      <div className="w-full h-2 bg-gray-300 rounded">
        <div
          className={`h-2 rounded ${getStrengthColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {strength < 2
          ? "Weak Password"
          : strength === 2 || strength === 3
          ? "Moderate Password"
          : "Strong Password"}
      </p>
    </div>
  );
};

export default PasswordStrength;
