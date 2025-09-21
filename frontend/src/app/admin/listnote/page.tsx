"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminNotes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "title" | "created_at" | "updated_at" | "user"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterUser, setFilterUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(10);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch notes list
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get("http://localhost:8000/admin/getnotes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const noteData = response.data as Note[];
      setNotes(noteData);
    } catch (error) {
      console.error("Error fetching notes data:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  // Delete note
  const deleteNote = async (noteId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/admin/delete/note/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error: any) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter and sort notes
  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUser =
        !filterUser ||
        note.user.name.toLowerCase().includes(filterUser.toLowerCase()) ||
        note.user.email.toLowerCase().includes(filterUser.toLowerCase());

      return matchesSearch && matchesUser;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === "user") {
        aValue = a.user.name;
        bValue = b.user.name;
      } else if (sortBy === "created_at" || sortBy === "updated_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const openNoteModal = (note: Note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const closeNoteModal = () => {
    setSelectedNote(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notes...</p>
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
                Notes Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and oversee all user notes in the system
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Manage Users
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
        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Notes
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, content, or user..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filter by User */}
            <div>
              <label
                htmlFor="filterUser"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by User
              </label>
              <input
                type="text"
                id="filterUser"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                placeholder="Filter by user name or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="created_at">Created Date</option>
                <option value="updated_at">Updated Date</option>
                <option value="title">Title</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label
                htmlFor="sortOrder"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort Order
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Notes</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {notes.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Filtered Results
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {filteredNotes.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Unique Authors
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {new Set(notes.map((note) => note.user_id)).size}
            </p>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {note.title}
                </h3>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => openNoteModal(note)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="View full note"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete note"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateContent(note.content)}
              </p>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div>
                    <p className="text-gray-700">
                      {note.user?.name || "Unknown user"}
                    </p>
                    <p>{note.user?.email || "No email"}</p>
                  </div>
                  <div className="text-right">
                    <p>Created: {formatDate(note.created_at)}</p>
                    {note.updated_at !== note.created_at && (
                      <p>Updated: {formatDate(note.updated_at)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white rounded-lg shadow-md px-6 py-3 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstNote + 1} to{" "}
              {Math.min(indexOfLastNote, filteredNotes.length)} of{" "}
              {filteredNotes.length} notes
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === page
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No notes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterUser
                ? "Try adjusting your search criteria."
                : "No notes have been created yet."}
            </p>
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedNote.title}
              </h3>
              <button
                onClick={closeNoteModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Author: {selectedNote.user.name} ({selectedNote.user.email})
              </p>
              <p className="text-sm text-gray-600">
                Created: {formatDate(selectedNote.created_at)}
              </p>
              {selectedNote.updated_at !== selectedNote.created_at && (
                <p className="text-sm text-gray-600">
                  Updated: {formatDate(selectedNote.updated_at)}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Content:
              </h4>
              <div className="p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeNoteModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  deleteNote(selectedNote.id);
                  closeNoteModal();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
