"use client";

import { useEffect, useState, FormEvent } from "react";
import { db } from "../firebase"; // Firebase config file
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";

type User = {
  id: string; // Firestore id
  name: string;
  email: string;
  image: string;
  role: string;
  phone: string;
  gender: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the image file

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as User)
      );
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const addUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const newUser = { image: imageUrl, name, email, role, phone, gender };

      if (editUserId) {
        // If we are editing, update the user
        const userDoc = doc(db, "users", editUserId);
        await updateDoc(userDoc, newUser);
        setUsers(
          users.map((user) =>
            user.id === editUserId ? { id: editUserId, ...newUser } : user
          )
        ); // Update user in local state
        setEditUserId(null); // Clear edit mode
      } else {
        // Otherwise, add a new user
        const docRef = await addDoc(collection(db, "users"), newUser);
        setUsers([...users, { id: docRef.id, ...newUser }]);
      }

      // Clear input fields
      setName("");
      setEmail("");
      setRole("");
      setPhone("");
      setGender("");
      setImageFile(null);
    } catch (error) {
      console.error("Error adding/updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to set user details for editing
  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPhone(user.phone);
    setGender(user.gender);
    setImageFile(null); // Clear previous image
    setEditUserId(user.id); // Set the user id to edit
  };

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId)); // Remove user from local state
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <form onSubmit={addUser} className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <span className="mr-4">Gender:</span>
          <label className="mr-4">
            <input
              type="radio"
              value="Male"
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
              className="mr-2"
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="Female"
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
              className="mr-2"
            />
            Female
          </label>
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {editUserId ? "Update User" : "Add User"}
        </button>
      </form>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {/* <th className="border-2 px-4 py-2">ID</th> */}
            <th className="border-2 px-4 py-2">Name</th>
            <th className="border-2 px-4 py-2">Email</th>
            <th className="border-2 px-4 py-2">Role</th>
            <th className="border-2 px-4 py-2">Phone</th>
            <th className="border-2 px-4 py-2">Gender</th>
            <th className="border-2 px-4 py-2">Image</th>
            <th className="border-2 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="flex items-center justify-center">
              <td colSpan={8} className="loader text-center py-4">
                {/* Loading... */}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b">
                {/* <td className="px-4 py-2">{user.id}</td> */}
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.gender}</td>
                <td className="px-4 py-2">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt="user"
                      className="w-16 h-16 object-cover rounded-full"
                      width={64}
                      height={64}
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => editUser(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
