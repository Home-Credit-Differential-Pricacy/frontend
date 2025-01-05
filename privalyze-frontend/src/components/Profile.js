import React, { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("Kemal");
  const [email, setEmail] = useState("kemal@hotmail.com");
  const [profilePic, setProfilePic] = useState("/default-avatar.png");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profil güncellendi!");
    // Güncelleme backend'e gönderilebilir.
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profilim</h2>
      <form onSubmit={handleProfileUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Profil Fotoğrafı</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(URL.createObjectURL(e.target.files[0]))}
            className="file-input file-input-bordered w-full"
          />
          <img src={profilePic} alt="Profil Fotoğrafı" className="mt-4 h-24 w-24 rounded-full" />
        </div>
        <button type="submit" className="btn btn-primary">Güncelle</button>
      </form>
    </div>
  );
};

export default Profile;
