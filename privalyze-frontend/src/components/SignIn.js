import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signin", formData);
      alert(response.data.message);
      setIsAuthenticated(true); // Kullanıcı oturum açtı
      navigate("/dashboard"); // Dashboard'a yönlendir
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">
          Welcome Back!
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg font-medium">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input input-bordered w-full"
            />
          </div>
          <button
            type="submit"
            className="btn bg-primary text-white w-full hover:bg-secondary"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
