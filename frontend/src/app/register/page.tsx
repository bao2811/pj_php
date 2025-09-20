"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaKey } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState("password");
  const [showVerifyPassword, setShowVerifyPassword] = useState("password");

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email is not valid");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validate();
  };

  const pass = () => {
    if (showPassword === "password") {
      setShowPassword("text");
    } else {
      setShowPassword("password");
    }
  };

  const verifyPass = () => {
    if (showVerifyPassword === "password") {
      setShowVerifyPassword("text");
    } else {
      setShowVerifyPassword("password");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/register",
        formData
      );
      console.log(res);
      if (res) {
        const data = res.data;
        if (res.status === 201) {
          setMessage({ type: "success", text: "Registration successful!" });
          setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
          });
          router.push("/login");
        }
      }
    } catch (error) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center text-black border-2 border-gray-300 p-8 m-4 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center flex justify-center items-center mb-4 gap-2 bg-blue-300 p-4 rounded-lg w-full">
            <FaKey />
            <h1 className="text-xl">Register</h1>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div>
              <label htmlFor="name" className="block text-sm mb-1 font-medium">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 focus:ring-blue-400 rounded-lg"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg pr-10 focus:ring-blue-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 font-medium">
                Password:
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 focus:ring-blue-400 rounded-lg pr-10"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={pass}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword === "password" ? (
                    <FaRegEyeSlash />
                  ) : (
                    <FaRegEye />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                className="mb-1 font-medium flex flex-col"
                htmlFor="password_confirmation"
              >
                Verify Password:
                <div className="relative w-full">
                  <input
                    type={showVerifyPassword}
                    className="w-full border border-gray-300 p-2 focus:ring-blue-400 rounded-lg pr-10"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    name="password_confirmation"
                    placeholder="********"
                    required
                  ></input>
                  <button
                    type="button"
                    onClick={verifyPass}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showVerifyPassword === "password" ? (
                      <FaRegEyeSlash />
                    ) : (
                      <FaRegEye />
                    )}
                  </button>
                </div>
              </label>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {message.text && (
              <p
                className={
                  message.type === "success" ? "text-green-500" : "text-red-500"
                }
              >
                {message.text}
              </p>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Register
            </button>
          </form>
          <div className="mt-4">
            <p>
              Already have an account?
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
