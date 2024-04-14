import React, { useEffect, useState, useContext } from "react";
import "./AdminRevokePage.css";
import { AuthContext } from "./authContext";
import axios from "axios";
import { AdminContext } from "./adminContext";
interface User {
  id: number;
  name: string;
  email: string;
  isRevoked: boolean;
}

const AdminRevokePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { currentAdmin } = useContext(AdminContext);

  useEffect(() => {
    axios
      .get("http://localhost:8081/backend/admins/adminGetInfo")
      .then((response) => {
        const updatedUsers = response.data.map((user: User) => ({
          ...user,
          isRevoked: false,
        }));
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const revokeUserCertificate = (userId: number) => {
    axios
      .post(
        "http://localhost:8081/backend/revokes/revokeCertificate",
        { userId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        alert(response.data.message);
        // 更新对应用户的 isRevoked 状态
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, isRevoked: true } : user
        );
        setUsers(updatedUsers);
        console.log(updatedUsers);
      })
      .catch((error) => {
        console.error("Error revoking certificate:", error);
        alert("Failed to revoke certificate");
      });
  };

  return (
    <div className="adminRevokePg">
      <div className="adminRevokeCard">
        {users.map((user, index) => (
          <div className="userToBeRevoked" key={index}>
            <div className="revokeUserInfo-name">{user.name}</div>
            <div className="revokeUserInfo-email">{user.email}</div>
            <div className="revokeUserBtns">
              <button className="revokeUserProfileBtn">Profile</button>
              {currentAdmin && (
                <button
                  className="revokeUserBtn"
                  onClick={() => revokeUserCertificate(user.id)}
                  disabled={user.isRevoked}
                  style={{
                    backgroundColor: user.isRevoked ? "#cccccc" : "",
                    cursor: user.isRevoked ? "not-allowed" : "",
                  }}
                >
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRevokePage;
