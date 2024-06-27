import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APP = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const [batchSchedules, setBatchSchedules] = useState([]);

  useEffect(() => {
    const fetchBatchSchedules = async () => {
      try {
        const response = await axios.get(`${APP}/api/schedules/today`);
        setBatchSchedules(response.data); // Assuming response.data is an array of batch schedules
      } catch (error) {
        console.error('Error fetching batch schedules:', error);
      }
    };

    fetchBatchSchedules();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Schedule of Multiple Batches</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {batchSchedules.map((batchSchedule, index) => (
          <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{batchSchedule.batchName}</h2>
            {batchSchedule.schedules.map((studentSchedule, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <h3>{studentSchedule.studentName}</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {studentSchedule.schedule.map((item, id) => (
                    <li key={id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold' }}>{new Date(item.classDate).toLocaleDateString()}</span>
                      <ul style={{ marginLeft: '10px', flex: 1, listStyleType: 'none', padding: 0 }}>
                        {item.classes.map((cls, classIndex) => (
                          <li key={classIndex} style={{ marginBottom: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>{cls.time}</span> - {cls.topic} (Professor: {cls.professor})
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
