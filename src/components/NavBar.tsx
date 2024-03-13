import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const navigate = useNavigate(); 

  const isLoggedIn = Boolean(localStorage.getItem('userEmail'));

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); 
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li className="home-item"><Link to="/">NFTinusite</Link></li>
        <div className="right-items">
        <li><Link to="/forum"><button className="forum-btn">Community</button></Link></li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          ) : (
            <li><Link to="/login"><button className="nav-button">Login</button></Link></li>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
