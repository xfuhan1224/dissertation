import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "./authContext";
import { AdminContext } from "./adminContext";
const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { currentAdmin, setCurrentAdmin } = useContext(AdminContext);
  const isLoggedIn = currentUser !== null;
  const isAdminLoggedIn = currentAdmin !== null;

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setCurrentAdmin(null);
    navigate("/adminlogin");
  };

  return (
    <nav>
      <ul>
        <li className="home-item">
          <Link to="/">NFTinusite</Link>
        </li>
        <div className="right-items">
          <li>
            <Link to="/create">
              <button className="create-btn">Create</button>
            </Link>
          </li>
          <li>
            <Link to="/market">
              <button className="market-btn">Market</button>
            </Link>
          </li>
          <li>
            <Link to="/forum">
              <button className="forum-btn">Community</button>
            </Link>
          </li>
          <li>
            <Link to="/posts">
              <button className="post-btn">Posts</button>
            </Link>
          </li>
          {isAdminLoggedIn && (
            <li>
              <Link to="/adminrevokepage">
                <button className="revoke-btn">Revoke</button>
              </Link>
            </li>
          )}
          {!isAdminLoggedIn && (
            <li>
              <Link to="/adminlogin">
                <button className="nav-button" disabled={isLoggedIn}>
                  Admin
                </button>
              </Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/login">
                <button className="nav-button" disabled={isAdminLoggedIn}>
                  Login
                </button>
              </Link>
            </li>
          )}
          {isAdminLoggedIn && (
            <li>
              <button onClick={handleAdminLogout} className="adminLogout-btn">
                AdminLogout
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li className="profile-icon-container">
              <Link to="/profile">
                <img
                  src={`http://localhost:8081/${currentUser?.profilePic}`}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
