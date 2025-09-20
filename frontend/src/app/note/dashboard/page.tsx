"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import Rechart from "@/components/rechart";
import { BarChartDemo } from "@/components/rechart";
import { useUser } from "@/components/User";

interface User {
  id: number;
  name: string;
  email: string;
}

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

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
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-rows-[2fr_3fr] gap-2 min-h-screen">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 display">
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
                      href="note/notes"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      → Manage Notes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="note/profile"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      → Edit Profile
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-black w-full">
            <div className="bg-white shadow overflow-hidden md:rounded-lg p-6 w-full h-full border border-gray-200">
              <BarChartDemo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
