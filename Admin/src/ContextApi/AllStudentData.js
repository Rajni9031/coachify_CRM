// allstudentDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const APP = process.env.REACT_APP_API_URL;

const AllStudentDataContext = createContext();

const AllStudentDataProvider = ({ children }) => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${APP}/api/student/alldata`); // Adjust API endpoint
        setStudentData(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <AllStudentDataContext.Provider value={studentData}>
      {children}
    </AllStudentDataContext.Provider>
  );
};

export { AllStudentDataContext, AllStudentDataProvider };
