import React, { useState } from "react";

const TwoFactorAuth = ({ onSubmit }) => {
  const [code, setCode] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (code === "123456") {
      alert("Giriş başarılı!");
      onSubmit();
    } else {
      alert("Kod yanlış!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">İki Faktörlü Kimlik Doğrulama</h2>
      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Doğrulama Kodu</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary">Doğrula</button>
      </form>
    </div>
  );
};

export default TwoFactorAuth;
