import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          "http://localhost:8000/api/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If token is invalid, redirect to login
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto"
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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard | My Notes App</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-indigo-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold">My Notes App</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-indigo-200">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Dashboard
              </h2>
              <Link
                href="/notes"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-sm transition-colors duration-200"
              >
                Go to Notes
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dashboard widgets or summary cards could go here */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="text-lg font-medium text-blue-800">
                  Your Profile
                </h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Name:{" "}
                    <span className="font-medium text-gray-800">
                      {user?.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email:{" "}
                    <span className="font-medium text-gray-800">
                      {user?.email}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <h3 className="text-lg font-medium text-green-800">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="/notes"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      → Manage Notes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      → Edit Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
