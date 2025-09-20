"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/User";

interface NoteStats {
  totalNotes: number;
  recentNotes: number;
  oldestNote?: string;
  newestNote?: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface EditProfile {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const router = useRouter();
  const { user, loading: userLoading, refetch } = useUser();
  const [loading, setLoading] = useState(true);
  const [noteStats, setNoteStats] = useState<NoteStats>({
    totalNotes: 0,
    recentNotes: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<EditProfile>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch note statistics
  const fetchNoteStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get<Note[]>(
        "http://localhost:8000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notes = response.data;
      const totalNotes = notes.length;

      // Calculate recent notes (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentNotes = notes.filter(
        (note: Note) => new Date(note.created_at) > weekAgo
      ).length;

      // Find oldest and newest notes
      const sortedByDate = notes.sort(
        (a: Note, b: Note) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setNoteStats({
        totalNotes,
        recentNotes,
        oldestNote: sortedByDate[0]?.created_at,
        newestNote: sortedByDate[sortedByDate.length - 1]?.created_at,
      });
    } catch (error) {
      console.error("Error fetching note stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize edit form with user data
  useEffect(() => {
    if (user) {
      setEditForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Check authentication and fetch data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchNoteStats();
  }, [router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (
      editForm.newPassword &&
      editForm.newPassword !== editForm.confirmPassword
    ) {
      setError("New passwords do not match");
      setUpdateLoading(false);
      return;
    }

    if (editForm.newPassword && editForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setUpdateLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const updateData: any = {
        name: editForm.name,
        email: editForm.email,
      };

      // Only include password fields if changing password
      if (editForm.newPassword) {
        updateData.current_password = editForm.currentPassword;
        updateData.password = editForm.newPassword;
        updateData.password_confirmation = editForm.confirmPassword;
      }

      await axios.put("http://localhost:8000/api/user/update", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Profile updated successfully!");
      setIsEditMode(false);
      setEditForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Refresh user data
      await refetch();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your account and view your activity
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Personal Information
                </h3>
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setError("");
                      setEditForm((prev) => ({
                        ...prev,
                        name: user.name,
                        email: user.email,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                    }}
                    className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="p-6">
                {!isEditMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">#{user.id}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Change Password (Optional)
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={editForm.currentPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={editForm.newPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={editForm.confirmPassword}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditMode(false);
                          setError("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
                      >
                        {updateLoading ? "Updating..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Note Statistics */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Note Statistics
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Total Notes
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {noteStats.totalNotes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Recent Notes (7 days)
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      {noteStats.recentNotes}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-600">
                          First Note
                        </span>
                        <p className="text-sm text-gray-900">
                          {formatDate(noteStats.oldestNote)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">
                          Latest Note
                        </span>
                        <p className="text-sm text-gray-900">
                          {formatDate(noteStats.newestNote)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/note/notes")}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    View All Notes →
                  </button>
                  <button
                    onClick={() => router.push("/note/notes")}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    Create New Note →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
