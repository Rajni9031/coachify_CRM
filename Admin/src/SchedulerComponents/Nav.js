import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useUser } from '../ContextApi/UserContext'; // Import the useUser hook

const APP = process.env.REACT_APP_API_URL;

function Nav({ panelType, studentName }) {
  const { user } = useUser(); // Extract user from the context API
  const panelTitle = panelType === 'student' ? 'Student Panel' : 'Admin Panel';
  const panelItems = panelType === 'student' 
    ? ['Home', 'Class Schedule', 'Profile'] // Example student-specific items
    : ['Dashboard', 'Users', 'Settings']; // Example admin-specific items
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [batch, setBatch] = useState({});
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef(null); // Ref for dropdown menu

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const fetchBatchDetails = async () => {
      try {
        const response = await axios.get(`${APP}/api/batches/${batchId}`);
        setBatch(response.data);
      } catch (error) {
        console.error('Error fetching batch details:', error);
      }
    };

    fetchBatchDetails();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [batchId]);

  useEffect(() => {
    // Function to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens, redirect to login page)
    // localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown state
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#b6b4df',
    padding: '10px',
    marginTop: '20px',
    marginBottom: '30px',
    marginLeft: '2vw',
    marginRight: '2vh',
    borderRadius: '10px',
    alignItems: 'center',
  };

  const dropdownStyle = {
    position: 'relative',
  };

  const adminPanelStyle = {
    color: 'black',
    textDecoration: 'none',
    fontSize: '18px',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
  };

  const leftyStyle = {
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    cursor: panelType === 'student' ? 'default' : 'pointer', // Set cursor to default for student panel
  };

  const rightyStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '30px',
    margin: '0 auto', // Center the title
    fontWeight: 'bold',
  };

  return (
    <div style={navbarStyle}>
      {panelType !== 'student' && (
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <FaArrowLeft
            style={{
              fontSize: '24px',
              color: 'black',
              marginTop: '15px',
              marginRight: '5px'
            }}
          />
          <span style={{ color: 'black', marginTop: '15px', marginRight: '15px'}}>Back</span>
        </div>
      )}
      <div style={leftyStyle}>
        {panelType === 'student' ? (
          <div style={{ ...adminPanelStyle, backgroundColor: '#fff', color: '#000' }}>{batch.name}</div>
        ) : (
          <Link to={`/BatchDetail/${batchId}`} style={{ ...adminPanelStyle, backgroundColor: '#fff', color: '#000' }}>{batch.name}</Link>
        )}
      </div>
  
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={titleStyle}>
          {panelTitle}
        </div>
      </div>
      <div style={rightyStyle}>
        {panelType === 'student' && (
          <div className="dropdown" ref={dropdownRef} style={dropdownStyle}>
            <button 
              className="btn btn-secondary dropdown-toggle" 
              type="button" 
              id="dropdownMenuButton" 
              aria-expanded={dropdownOpen ? 'true' : 'false'}
              onClick={toggleDropdown}
            >
              {studentName}
            </button>
           <ul 
  style={{
    width: 'fit-content',
    margin: '5px 0 0',
    padding: '0',
    listStyle: 'none',
    backgroundColor: '#fff',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '0.25rem',
    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.175)',
    display: dropdownOpen ? 'block' : 'none',  // Toggle visibility
  }} 
  aria-labelledby="dropdownMenuButton"
>
  <li style={{ margin: '0', padding: '0' }}>
    <button 
      className="dropdown-item" 
      onClick={handleLogout} 
      style={{
        display: 'block',
        width: '100%',
        padding: '0.25rem 1.5rem',
        fontWeight: 'normal',
        color: '#212529',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  </li>
</ul>
          </div>
        )}
        {panelType !== 'student' && user && user.name && (
          <div style={{ ...adminPanelStyle, color: '#fff' }}></div> // Render user name only in admin panel
        )}
      </div>
    </div>
  );
}

export default Nav;
