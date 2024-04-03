import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";

interface Admin {
  id: number;
  name: string;
}

interface AdminContextType {
  currentAdmin: Admin | null;
  adminLogin: (inputs: any) => Promise<void>;
  setCurrentAdmin: (user: Admin | null) => void;
}

export const AdminContext = createContext<AdminContextType>({
  currentAdmin: null,
  adminLogin: async () => {},
  setCurrentAdmin: () => {},
});

interface AdminContextProviderProps {
  children: ReactNode;
}

export const AdminContextProvider: React.FC<AdminContextProviderProps> = ({
  children,
}) => {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(
    JSON.parse(localStorage.getItem("admin") || "null")
  );

  const adminLogin = async (inputs: any) => {
    try {
      const res = await axios.post(
        "http://localhost:8081/backend/admins/adminLogin",
        inputs,
        {
          withCredentials: true,
        }
      );
      setCurrentAdmin(res.data);
      localStorage.setItem("admin", JSON.stringify(res.data));
      const postsRes = await axios.get("http://localhost:8081/backend/posts", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(currentAdmin));
  }, [currentAdmin]);

  return (
    <AdminContext.Provider
      value={{ currentAdmin, adminLogin, setCurrentAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
