// StudentContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const StudentContext = createContext();

const StudentProvider = ({ studentId, children }) => {
    const [student, setStudent] = useState(null);
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        if (studentId) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/student/${studentId}`)
                .then(response => {
                    setStudent(response.data);
                    setStartDate(response.data.startDate);
                })
                .catch(error => console.error('Error fetching student details:', error));
        }
    }, [studentId]);

    return (
        <StudentContext.Provider value={{ student, startDate }}>
            {children}
        </StudentContext.Provider>
    );
};

export { StudentContext, StudentProvider };
