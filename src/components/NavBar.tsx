import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { AuthContext } from "./authContext";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const isLoggedIn = currentUser !== null;

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li className="home-item">
          <Link to="/">NFTinusite</Link>
        </li>
        <div className="right-items">
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
          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login">
                <button className="nav-button">Login</button>
              </Link>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
