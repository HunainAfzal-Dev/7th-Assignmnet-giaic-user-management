"use client" 

import { useEffect, useState, FormEvent } from "react";
import { db } from "./firebase"; // Firebase config file
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

type User = {
  id: string; // Firestore me id string hota hai
  name: string;
  email: string;
  image: string;
  role: string;
  phone: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null); // To track the user being edited

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

    const storage = getStorage();
    const imageInput = document.getElementById("imageInput") as HTMLInputElement;
    const imageFile = imageInput.files?.[0];

    if (!imageFile) {
      console.error("no file selected!");
      return;
    }

    const storageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    const newUser = { image: imageUrl, name, email, role, phone };

    if (editUserId) {
      // If we are editing, update the user
      const userDoc = doc(db, "users", editUserId);
      await updateDoc(userDoc, newUser);
      setUsers(users.map(user => user.id === editUserId ? { id: editUserId, ...newUser } : user)); // Update user in local state
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
    imageInput.value = "";
  };

  // Function to set user details for editing
  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPhone(user.phone);
    setImage(user.image);
    setEditUserId(user.id); // Set the user id to edit
  };

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, "users", userId));
    setUsers(users.filter(user => user.id !== userId)); // Remove user from local state
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
            type="file"
            id="imageInput"
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="tel"
            id="phone"
            placeholder="Enter Your Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {editUserId ? "Update User" : "Add User"}
          </button>
        </div>
      </form>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border-2 w-[10%] px-4 py-2 text-left">ID</th>
            <th className="border-2 px-4 py-2 text-left">Name</th>
            <th className="border-2 px-4 py-2 text-left">Email</th>
            <th className="border-2 px-4 py-2 text-left">Role</th>
            <th className="border-2 px-4 py-2 text-left">Phone</th>
            <th className="border-2 px-4 py-2 text-left">Image</th>
            <th className="border-2 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="image"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                ) : (
                  ""
                )}
              </td>
              <td className="px-4 py-2">
                <button onClick={() => editUser(user)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:underline ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
