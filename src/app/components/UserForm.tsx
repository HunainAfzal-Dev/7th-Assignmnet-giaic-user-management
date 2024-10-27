
"use client";
import { FormEvent } from "react";
import "../globals.css";

type UserFormProps = {
  name: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  imageFile: File | null;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: string) => void;
  setPhone: (phone: string) => void;
  setGender: (gender: string) => void;
  setImageFile: (file: File | null) => void;
  addUser: (e: FormEvent) => void;
  editUserId: string | null;
};

const UserForm: React.FC<UserFormProps> = ({
  name,
  email,
  role,
  phone,
  gender,
  // imageFile,
  setName,
  setEmail,
  setRole,
  setPhone,
  setGender,
  setImageFile,
  addUser,
  editUserId,
}) => {
  return (
    <form
      onSubmit={addUser}
      className="mb-6 p-6  backdrop-blur-2xl border rounded-lg shadow-xl max-w-2xl mx-auto animate-fade-in"
    >
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 p-3 backdrop-blur-2xl bg-white/30 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-900 transition-all"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 p-3 backdrop-blur-2xl bg-white/30 border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-900 transition-all"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="flex-1 p-3 backdrop-blur-2xl bg-white/30 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-900 transition-all"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="flex-1 p-3 backdrop-blur-2xl bg-white/30 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-900 transition-all"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
          className="flex-1 p-3 backdrop-blur-2xl bg-white/30 border border-gray-600 rounded-md shadow-sm text-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-900 transition-all"
        />
      </div>
      <div className="mb-4 text-white">
        <span className="mr-4">Gender:</span>
        <div className="flex gap-2">
          <div
            className={`flex items-center justify-center w-20 h-10 border-2 rounded-lg cursor-pointer transition duration-300 ${
              gender === "Male"
                ? "border-gray-900 bg-gray-600 text-white" 
                : "border-gray-800 bg-white text-gray-800"
            }`}
            onClick={() => setGender("Male")}
          >
            <div className="font-semibold">Male</div>
          </div>
          <div
            className={`flex items-center justify-center w-20 h-10 border-2 rounded-lg cursor-pointer transition duration-300 ${
              gender === "Female"
                ? "border-gray-800 bg-gray-600 text-white"
                : "border-gray-800 bg-white text-gray-800"
            }`}
            onClick={() => setGender("Female")}
          >
            <div className="font-semibold">Female</div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-3 border-4 border-gray-800 bg-white text-gray-800  hover:bg-gray-600 hover:text-white  rounded-md shadow-md hover:bg-gradient-to-r  transition-transform transform hover:scale-105"
      >
        {editUserId ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
