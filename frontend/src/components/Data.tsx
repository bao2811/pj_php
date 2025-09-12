"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Define the Note type for better TypeScript support
interface Note {
  id?: number;
  title: string;
  content: string;
}

export const Data = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<Note>({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<number | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch all notes when the component mounts
  const fetchNotes = () => {
    axios
      .get("http://localhost:8000/api/notes")
      .then((response) => {
        setNotes(response.data as Note[]);
      })
      .catch((error) => {
        console.error("There was an error fetching the notes!", error);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open modal for creating a new note
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ title: "", content: "" });
    setCurrentNoteId(undefined);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing note
  const handleEdit = (note: Note) => {
    setIsEditing(true);
    setFormData({ title: note.title, content: note.content });
    setCurrentNoteId(note.id);
    setIsModalOpen(true);
  };

  // Handle form submission (create or update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && currentNoteId) {
      // Update existing note
      axios
        .put(`http://localhost:8000/api/notes/${currentNoteId}`, formData)
        .then(() => {
          fetchNotes();
          setIsModalOpen(false);
          setFormData({ title: "", content: "" });
        })
        .catch((error) => {
          console.error("Error updating the note!", error);
        });
    } else {
      // Create new note
      axios
        .post("http://localhost:8000/api/notes", formData)
        .then(() => {
          fetchNotes();
          setIsModalOpen(false);
          setFormData({ title: "", content: "" });
        })
        .catch((error) => {
          console.error("Error creating the note!", error);
        });
    }
  };

  // Delete a note
  const handleDelete = (id: number | undefined) => {
    if (!id) return;

    if (window.confirm("Are you sure you want to delete this note?")) {
      axios
        .delete(`http://localhost:8000/api/notes/${id}`)
        .then(() => {
          fetchNotes();
        })
        .catch((error) => {
          console.error("Error deleting the note!", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-indigo-700">My Notes</h1>
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Note
        </button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-gray-500 text-lg">No notes available. Create a new one!</p>
          <button
            onClick={handleAddNew}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition-all duration-200"
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 pb-2 border-b border-gray-100">{note.title}</h2>
              <p className="mt-2 text-gray-600 flex-grow overflow-hidden text-ellipsis">{note.content}</p>
              <div className="flex mt-6 justify-end space-x-3">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Note" : "Create New Note"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter note title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-gray-700 text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Write your note content here..."
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all min-h-[150px]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all duration-200 flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Update Note
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Save Note
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
