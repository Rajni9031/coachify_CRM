import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../style.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from '../img/coachifylogo.png';
import { useUser } from '../ContextApi/UserContext';

const APP = process.env.REACT_APP_API_URL;

function Header({ title, showNotifications }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, setUser } = useUser();
  const { username } = useParams();
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    const fetchProfileName = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`${APP}/api/profile/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.data) {
          throw new Error('Network response was not ok');
        }

        setUser((prevUser) => ({
          ...prevUser,
          name: response.data.name,
        }));
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (!user.name) {
      fetchProfileName();
    }
  }, [user.name, setUser, username]);

  useEffect(() => {
    if (profileDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <header id="header" className={`header fixed-top d-flex align-items-center ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="d-flex align-items-center justify-content-between w-100">
        <Link to="/" className="logo d-flex align-items-center">
          <img src={logo} alt="Coachify Logo" className="coachify-logo" />
        </Link>
        <div className="admin-panel-text">
          <span className="d-none d-lg-block" style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {title}
          </span>
        </div>
        <div className="header-nav-wrapper">
          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
              <li className="nav-item d-block d-lg-none">
                <a className="nav-link nav-icon search-bar-toggle" href="#">
                  <i className="bi bi-search"></i>
                </a>
              </li>

              {showNotifications && (
                <li className="nav-item dropdown">
                  <a className="nav-link nav-icon dropdown-toggle" href="#" id="navbarDropdownNotification" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-bell"></i>
                    <span className="badge bg-primary badge-number">4</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownNotification">
                    {/* {notificationDropdownData.map(item => (
                      <li key={item.id}><span className="dropdown-item">{item.title}</span></li>
                    ))} */}
                  </ul>
                </li>
              )}

              <li className="nav-item dropdown pe-3" ref={dropdownRef}>
                <a className="nav-link nav-profile dropdown-toggle d-flex align-items-center pe-0" href="#" id="navbarDropdownProfile" role="button" aria-expanded={profileDropdownOpen} onClick={toggleProfileDropdown}>
                  <span className="d-none d-md-block ps-2">{user.name || 'Loading...'}</span>
                </a>
                <ul className={`dropdown-menu dropdown-menu-end ${profileDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownProfile">
                  <li className="dropdown-header">
                    <h6>{user.name || 'Loading...'}</h6>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" to="/admin">
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
