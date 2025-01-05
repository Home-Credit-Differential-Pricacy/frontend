import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Şifre sıfırlama bağlantısı ${email} adresine gönderildi!`);
    // Backend'den sıfırlama e-posta işlemi çağrılabilir
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Şifremi Unuttum</h2>
      <form onSubmit={handleReset}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary">Şifre Sıfırla</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
