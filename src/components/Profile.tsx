import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import { AuthContext } from "./authContext";
import { CartProvider } from "./CartContext";
import Cart from "./Cart";
import axios from "axios";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profilePic: string;
  joinedAt: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("Collected");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (currentUser) {
        try {
          const { data } = await axios.get(
            "http://localhost:8081/backend/auth/userInfo",
            {
              withCredentials: true,
            }
          );

          const formattedJoinedAt = new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
          }).format(new Date(data.joinedAt));
          setProfile({
            ...data,
            joinedAt: formattedJoinedAt,
          });
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };

  return (
    <CartProvider>
      <div className="profile-home">
        <div className="profile-up">
          {profile?.profilePic ? (
            <img
              className="profile-pic"
              src={`http://localhost:8081/${profile?.profilePic}`}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="profile-pic-placeholder"></div>
          )}
          <div className="profile-userName">{profile?.name}</div>
          <div className="profile-createdAt">{`Joined ${profile?.joinedAt}`}</div>
        </div>
        <div className="profile-mid">
          <div className="profile-nav">
            <button
              className={`nav-btn ${selectedTab === "Cart" ? "selected" : ""}`}
              onClick={() => handleTabClick("Cart")}
            >
              Cart
            </button>
            <button
              className={`nav-btn ${
                selectedTab === "Collected" ? "selected" : ""
              }`}
              onClick={() => handleTabClick("Collected")}
            >
              Collected
            </button>
            <button
              className={`nav-btn ${
                selectedTab === "Activity" ? "selected" : ""
              }`}
              onClick={() => handleTabClick("Activity")}
            >
              Activity
            </button>
            <button
              className={`nav-btn ${
                selectedTab === "Created" ? "selected" : ""
              }`}
              onClick={() => handleTabClick("Created")}
            >
              Created
            </button>
            <button
              className={`nav-btn ${
                selectedTab === "Favorited" ? "selected" : ""
              }`}
              onClick={() => handleTabClick("Favorited")}
            >
              Favorited
            </button>
          </div>
        </div>
        <div className="profile-bottom">
          <div className="item-number">0 items</div>
          <div className="listed-items">
            {selectedTab === "Cart" && <Cart />}
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default Profile;
