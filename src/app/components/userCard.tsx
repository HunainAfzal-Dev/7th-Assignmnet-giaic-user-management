"use client";
import Image from "next/image";
import { useState } from "react";
import defaultProfile from "../../../public/9434619.jpg";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  image: string;
};

type UserCardProps = {
  user: User;
  editUser: (user: User) => Promise<void>; // Ensure this returns a Promise
  deleteUser: (id: string) => Promise<void>; // Ensure this returns a Promise
};

const UserCard: React.FC<UserCardProps> = ({ user, editUser, deleteUser }) => {
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    setLoading(true);
    try {
      await editUser(user);
    } catch (error) {
      console.error("Error editing user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative border rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-2xl transform-gpu">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl z-10">
          <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
        {user.image && (
          <Image
            src={user.image ? user.image : defaultProfile}
            alt="user"
            className="w-20 h-20 object-cover rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-110"
            width={80}
            height={80}
          />
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-100 transition-all duration-300 hover:text-blue-300">
            {user.name}
          </h2>
          <p className="text-gray-300 text-sm mt-1">{user.email}</p>
          <p className="text-gray-300 text-sm">{user.role}</p>
          <p className="text-gray-300 text-sm">{user.phone}</p>
          <p className="text-gray-300 text-sm">{user.gender}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center sm:justify-start gap-4">
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-300"
          disabled={loading}
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors duration-300"
          disabled={loading}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
