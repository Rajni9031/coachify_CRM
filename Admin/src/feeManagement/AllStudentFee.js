import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllStudentFee = ({ batchId }) => {
  const [students, setStudents] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (batchId) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/fees/batch/${batchId}`)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => console.error('Error fetching fee details:', error));
    }
  }, [batchId]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  };

  const trEvenStyle = {
    backgroundColor: '#f9f9f9',
  };

  const highlightStyle = {
    backgroundColor: '#dff0d8',
  };

  const tdResponsiveStyle = {
    display: 'block',
    width: '100%',
    textAlign: 'right',
    paddingLeft: '50%',
    position: 'relative',
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
              <th style={thStyle}>Installments</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student._id}
                style={
                  student.installments.every(installment => installment.paid)
                    ? highlightStyle
                    : index % 2 === 0
                    ? trEvenStyle
                    : null
                }
              >
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Student Name"
                >
                  {student.studentName}
                </td>
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Enrollment No"
                >
                  {student.enrollmentNo}
                </td>
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Total Fees"
                >
                  {student.totalFee}
                </td>
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Registration Fees"
                >
                  {student.registrationFee}
                </td>
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Scholarship"
                >
                  {student.scholarship}
                </td>
                <td
                  style={{ ...thTdStyle, ...(windowWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Installments"
                >
                  <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
                    {student.installments.map((installment, idx) => (
                      <li key={idx} style={{ marginBottom: '5px' }}>
                        Amount: {installment.amount}, Due: {new Date(installment.dueDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllStudentFee;
