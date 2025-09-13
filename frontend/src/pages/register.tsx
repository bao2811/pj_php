import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // API call to register
      const response = await axios.post<{ token: string; user: any }>(
        "http://localhost:8000/register",
        formData
      );

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);

      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};

        Object.keys(err.response.data.errors).forEach((key) => {
          serverErrors[key] = err.response.data.errors[key][0];
        });

        setErrors(serverErrors);
      } else {
        setErrors({
          general:
            err.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register | My Notes App</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 py-6 px-8">
            <h2 className="text-center text-3xl font-extrabold text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-indigo-200">
              Sign up to get started
            </p>
          </div>

          <div className="p-8">
            {errors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {errors.general}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-3 px-4
                    ${errors.name ? "border-red-300" : "border-gray-300"}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-3 px-4
                    ${errors.email ? "border-red-300" : "border-gray-300"}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-3 px-4
                    ${errors.password ? "border-red-300" : "border-gray-300"}`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md py-3 px-4
                    ${
                      errors.password_confirmation
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
