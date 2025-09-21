"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalUsers: number;
  totalNotes: number;
  newUsersThisMonth: number;
  newNotesThisMonth: number;
  monthlyUserData: number[];
  monthlyNoteData: number[];
  userGrowthPercentage: number;
  noteGrowthPercentage: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalNotes: 0,
    newUsersThisMonth: 0,
    newNotesThisMonth: 0,
    monthlyUserData: [],
    monthlyNoteData: [],
    userGrowthPercentage: 0,
    noteGrowthPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/admin/countnotes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const noteData = response.data as number[];
      setStats((prevStats) => ({
        ...prevStats,
        monthlyNoteData: noteData,
        newNotesThisMonth: noteData[new Date().getMonth()],
      }));

      const response2 = await axios.get(
        "http://localhost:8000/admin/countusers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response2.data as [number[], number];
      setStats((prevStats) => ({
        ...prevStats,
        monthlyUserData: userData[0],
        newUsersThisMonth: userData[0][new Date().getMonth()] || 0,
        totalUsers: userData[1],
      }));

      const response3 = await axios.get(
        "http://localhost:8000/admin/totalusersandnotes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalData = response3.data as {
        totalUsers: number;
        totalNotes: number;
      };
      setStats((prevStats) => ({
        ...prevStats,
        totalUsers: totalData.totalUsers,
        totalNotes: totalData.totalNotes,
      }));
    } catch (error) {
      console.error("Error fetching note data:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Chart data configuration
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyGrowthData = {
    labels: months,
    datasets: [
      {
        label: "New Users",
        data: stats.monthlyUserData,
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
      {
        label: "New Notes",
        data: stats.monthlyNoteData,
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Growth Statistics",
      },
    },
  };

  // Doughnut chart for distribution
  const distributionData = {
    labels: ["Active Users", "Total Notes"],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalNotes],
        backgroundColor: ["rgba(99, 102, 241, 0.8)", "rgba(34, 197, 94, 0.8)"],
        borderColor: ["rgba(99, 102, 241, 1)", "rgba(34, 197, 94, 1)"],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Overview of system statistics and performance
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Manage Users
              </button>
              <button
                onClick={() => router.push("/admin/listnote")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Manage Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.userGrowthPercentage}% from last month
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalNotes}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +{stats.noteGrowthPercentage}% from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* New Users This Month */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Users (This Month)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.newUsersThisMonth}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* New Notes This Month */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New Notes (This Month)
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.newNotesThisMonth}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Monthly Growth Trends
            </h3>
            <Bar data={monthlyGrowthData} options={chartOptions} />
          </div>

          {/* Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Overview
            </h3>
            <div className="h-64">
              <Doughnut
                data={distributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              User Management
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              View and manage all registered users
            </p>
            <button
              onClick={() => router.push("/admin/users")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              View Users
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Notes Management
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Browse and manage all user notes
            </p>
            <button
              onClick={() => router.push("/admin/listnote")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              View Notes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              System Analytics
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Detailed analytics and reports
            </p>
            <button
              onClick={() => fetchDashboardStats()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
