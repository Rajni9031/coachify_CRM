import React, { useState, useEffect } from 'react';

const AllStudentFee = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Simulating data fetch, you might replace this with an actual API call
    const fetchedStudents = [
      { id: 1, name: 'John Doe', totalFees: 1000, paidFees: 600, dueFees: 400 },
      { id: 2, name: 'Jane Smith', totalFees: 1200, paidFees: 1200, dueFees: 0 },
      { id: 2, name: 'Jane Smith', totalFees: 1200, paidFees: 1200, dueFees: 0 },
      { id: 2, name: 'Jane Smith', totalFees: 1200, paidFees: 1200, dueFees: 0 },
      { id: 2, name: 'Jane Smith', totalFees: 1200, paidFees: 1200, dueFees: 0 },
      { id: 3, name: 'Alice Johnson', totalFees: 800, paidFees: 300, dueFees: 500 },
      { id: 3, name: 'Alice Johnson', totalFees: 800, paidFees: 300, dueFees: 500 },
      { id: 3, name: 'Alice Johnson', totalFees: 800, paidFees: 300, dueFees: 500 },
      { id: 3, name: 'Alice Johnson', totalFees: 800, paidFees: 300, dueFees: 500 },
      // Add more students as needed
    ];
    setStudents(fetchedStudents);
  }, []);

  const containerStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    width: '100%',
    margin: '20px auto',
    boxSizing: 'border-box',
  };

  const headingStyle = {
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const tableContainerStyle = {
    overflowX: 'auto',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const thTdStyle = {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: '#f4f4f4',
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

  const tdBeforeStyle = {
    content: 'attr(data-label)',
    position: 'absolute',
    left: '0',
    width: '50%',
    paddingLeft: '15px',
    fontWeight: 'bold',
    textAlign: 'left',
  };

  const highlightStyle = {
    backgroundColor: 'lightgreen',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Fee Management</h1>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Student Name</th>
              <th style={thStyle}>Total Fees</th>
              <th style={thStyle}>Paid Fees</th>
              <th style={thStyle}>Due Fees</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                style={
                  student.dueFees === 0
                    ? highlightStyle
                    : index % 2 === 0
                    ? trEvenStyle
                    : null
                }
              >
                <td
                  style={{ ...thTdStyle, ...(window.innerWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Student Name"
                >
                  {student.name}
                </td>
                <td
                  style={{ ...thTdStyle, ...(window.innerWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Total Fees"
                >
                  ${student.totalFees}
                </td>
                <td
                  style={{ ...thTdStyle, ...(window.innerWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Paid Fees"
                >
                  ${student.paidFees}
                </td>
                <td
                  style={{ ...thTdStyle, ...(window.innerWidth <= 600 ? tdResponsiveStyle : {}) }}
                  data-label="Due Fees"
                >
                  ${student.dueFees}
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
