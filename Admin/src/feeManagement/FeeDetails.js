import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AllStudentDataContext } from '../ContextApi/AllStudentData';

const APP = process.env.REACT_APP_API_URL;

const FeeDetails = () => {
  const [feeDetails, setFeeDetails] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sortAsc, setSortAsc] = useState(true);
  const studentData = useContext(AllStudentDataContext);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await axios.get(`${APP}/api/fees`);
        setFeeDetails(response.data);
      } catch (error) {
        console.error('Error fetching fee details:', error);
      }
    };

    fetchFeeDetails();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSortByDueDate = () => {
    const sortedDetails = [...feeDetails].sort((a, b) => {
      const aDueDate = a.installments.length > 0 ? new Date(a.installments[0].dueDate) : new Date();
      const bDueDate = b.installments.length > 0 ? new Date(b.installments[0].dueDate) : new Date();
      return sortAsc ? aDueDate - bDueDate : bDueDate - aDueDate;
    });
    setFeeDetails(sortedDetails);
    setSortAsc(!sortAsc);
    };
    
    const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle empty or undefined dateString

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Month is zero-based
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
};

    

  const containerStyle = {
    background: '#f4f4f9',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  const headingStyle = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '2rem',
  };

  const tableContainerStyle = {
    width: '100%',
    maxWidth: '1200px',
    overflowX: 'auto',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thTdStyle = {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: '#3f51b5',
    color: '#fff',
    cursor: 'pointer',
  };

  const trEvenStyle = {
    backgroundColor: '#f9f9f9',
  };

  const tdResponsiveStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    paddingLeft: '50%',
    position: 'relative',
  };

  const checkboxStyle = {
    marginLeft: '10px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Fee Details of All Students</h1>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Student Name</th>
              <th style={thStyle}>Enrollment No</th>
              <th style={thStyle}>Total Fees</th>
              <th style={thStyle}>Registration Fees</th>
              <th style={thStyle}>Scholarship</th>
              <th style={thStyle} onClick={handleSortByDueDate}>Installments Due</th>
            </tr>
          </thead>
          <tbody>
            {feeDetails.map((fee, index) => {
              const student = studentData.find(s => s._id === fee.studentId);
              if (!student) return null;

              return (
                <tr key={fee._id} style={index % 2 === 0 ? trEvenStyle : null}>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Student Name">
                    {`${student.firstName} ${student.lastName}`}
                  </td>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Enrollment No">
                    {student.enrollmentNo}
                  </td>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Total Fees">
                    {fee.totalFee}
                  </td>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Registration Fees">
                    {fee.registrationFee}
                  </td>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Scholarship">
                    {fee.scholarship}
                  </td>
                  <td style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }} data-label="Installments">
                    <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
                      {fee.installments.map((installment, idx) => (
                        <li key={idx} style={{ marginBottom: '5px', backgroundColor: installment.paid ? '#4CAF50' : 'transparent' }}>
                          Amount: {installment.amount}, Due: {installment.dueDate}
                          <input type="checkbox" checked={installment.paid} readOnly style={checkboxStyle} />
                          <strong style={{ marginLeft: '5px' }}></strong>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeDetails;
