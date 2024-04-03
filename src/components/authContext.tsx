import axios from "axios";
import React, { createContext, useEffect, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  profilePic: string;
  joinedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (inputs: any) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  setCurrentUser: (user: User | null) => void;
}

// 创建带有明确类型的上下文
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  fetchUserInfo: async () => {},
  setCurrentUser: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (inputs: any) => {
    try {
      const res = await axios.post(
        "http://localhost:8081/backend/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );
      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      await fetchUserInfo();
      const postsRes = await axios.get("http://localhost:8081/backend/posts", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const fetchUserInfo = async () => {
    if (currentUser) {
      try {
        const res = await axios.get(
          `http://localhost:8081/backend/auth/${currentUser.id}`,
          { withCredentials: true }
        );
        setCurrentUser({ ...currentUser, ...res.data }); // 合并现有的currentUser信息与获取的用户信息
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...res.data })
        );
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, fetchUserInfo, setCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
