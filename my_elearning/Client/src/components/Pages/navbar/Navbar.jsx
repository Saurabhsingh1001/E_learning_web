import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Navbar.css';
import Swal from 'sweetalert2'
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = () => {
   
    localStorage.clear()
    Swal.fire("Logout successfull");
    navigate('/login');
  };

  const handleClick = () => {
    navigate('/home/mylearning');
  };

  const handleLogoClick = () => {
    navigate('/home'); // Go to the home page
  };

  // Conditionally render content based on the current route
  const renderContent = () => {
    if (location.pathname.includes('/home/mylearning')) {
      return (
        <>
          <div className="nav-log-container" onClick={handleLogoClick}>
            <div className="logoimg"></div>
          </div>
          <div className="navbar-links-container">
            <Link to="/login" onClick={handleNavigation}>
              Logout
            </Link>
          </div>
        </>
      );
    } else {
      // Default content for other routes
      return (
        <>
          <div className="nav-log-container">
            <div className="logoimg"></div>
          </div>
          <div className="navbar-links-container">
          <Link to="/login" onClick={handleNavigation}>
              Logout
            </Link>
            <Link to="/home/mylearning" onClick={handleClick}>
              My Learning
            </Link>
          </div>
        </>
      );
    }
  };

  return <nav>{renderContent()}</nav>;
};

export default Navbar;
