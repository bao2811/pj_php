"use client";

import React, { useEffect, useState } from "react";
import "./Navbar";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useUser } from "./User";

interface User {
  id: number;
  name: string;
  email: string;
}

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

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
      localStorage.removeItem("jwtToken");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Force logout even if API call fails
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Note App</h1>
          </div>
          <div className="space-x-4 border-2 rounded-lg flex w-1/2 justify-between px-4 py-2 bg-indigo-500 text-lg">
            <Link
              href="/note/dashboard"
              className={pathname === "/note/dashboard" ? "underline" : ""}
            >
              Dashboard
            </Link>
            <Link
              href="/note/notes"
              className={pathname === "/note/notes" ? "underline" : ""}
            >
              Notes
            </Link>
            <Link
              href="/note/profile"
              className={pathname === "/note/profile" ? "underline" : ""}
            >
              Profile
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className="text-indigo-200"
              onClick={() => setShowProfile(true)}
            >
              Welcome, {user?.name}
            </span>
            {showProfile && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-opacity-50 z-40"
                  onClick={() => setShowProfile(false)}
                />

                {/* Modal */}
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg z-50 w-200 h-100 text-black">
                  <h2 className="text-xl font-bold mb-4">Profile</h2>
                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={() => setShowProfile(false)}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
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
  );
};

export default Navbar;
