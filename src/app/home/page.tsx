// pages/index.tsx
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
import UserForm from "../components/UserForm";
import UserCard from "../components/userCard"; 
import * as XLSX from "xlsx"; // Import xlsx library

type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  phone: string;
  gender: string;
};

export default function Main() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
        const userDoc = doc(db, "users", editUserId);
        await updateDoc(userDoc, newUser);
        setUsers(
          users.map((user) =>
            user.id === editUserId ? { id: editUserId, ...newUser } : user
          )
        );
        setEditUserId(null);
      } else {
        const docRef = await addDoc(collection(db, "users"), newUser);
        setUsers([...users, { id: docRef.id, ...newUser }]);
      }

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

  const editUser = (user: User): Promise<void> => {
    return new Promise((resolve) => {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPhone(user.phone);
      setGender(user.gender);
      setEditUserId(user.id);
      resolve();
    });
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = (data: User[]) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white animate-bounce">
        User Management
      </h1>
      <div className="mb-8">
        <UserForm
          name={name}
          email={email}
          role={role}
          phone={phone}
          gender={gender}
          imageFile={imageFile}
          setName={setName}
          setEmail={setEmail}
          setRole={setRole}
          setPhone={setPhone}
          setGender={setGender}
          setImageFile={setImageFile}
          addUser={addUser}
          editUserId={editUserId}
        />
      </div>
      <div className="flex justify-end mb-6">
        <a className="downloadBtn" onClick={() => exportToExcel(users)}>
          <svg
            viewBox="0 0 256 256"
            height="32"
            width="38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16m-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12"
              fill="currentColor"
            ></path>
          </svg>
          download
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {loading ? (
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
        ) : (
          users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              editUser={editUser}
              deleteUser={deleteUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
