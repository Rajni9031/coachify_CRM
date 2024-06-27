import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APP = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [batchSchedules, setBatchSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchSchedules = async () => {
      try {
        const response = await axios.get(`${APP}/api/schedules/today`);
        setBatchSchedules(response.data); // Assuming response.data is an array of batch schedules
        setLoading(false);
      } catch (error) {
        console.error('Error fetching batch schedules:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBatchSchedules();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '20px',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  };

  const cardStyle = {
    flex: '1 1 calc(33.333% - 20px)',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    minWidth: '300px',
    maxWidth: 'calc(33.333% - 20px)',
    boxSizing: 'border-box',
  };

  const batchTitleStyle = {
    fontSize: '20px',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const noScheduleStyle = {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
  };

  const listItemStyle = {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  };

  const classTimeStyle = {
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Today's Batch Schedules</h1>
      <div style={gridStyle}>
        {batchSchedules.map((batchSchedule, index) => (
          <div key={index} style={cardStyle}>
            <h2 style={batchTitleStyle}>{batchSchedule.batchName}</h2>
            {batchSchedule.schedules === 'No classes scheduled for today' ? (
              <p style={noScheduleStyle}>No classes scheduled for today</p>
            ) : (
              <ul style={listStyle}>
                {batchSchedule.schedules.map((cls, id) => (
                  <li key={id} style={listItemStyle}>
                    <span style={classTimeStyle}>{cls.time}</span> - {cls.topic} (Professor: {cls.professor})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
