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
import UserForm from "../components/UserForm"; // Import UserForm
import UserCard from "../components/userCard"; // Import UserCard

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

  const editUser = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPhone(user.phone);
    setGender(user.gender);
    setEditUserId(user.id);
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white animate-bounce">
        User Management
      </h1>

      {/* User Form */}
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

      {/* User Cards Grid */}

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
