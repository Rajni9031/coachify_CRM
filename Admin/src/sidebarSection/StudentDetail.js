import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APP = process.env.REACT_APP_API_URL;

const StudentDetail = ({ onAddStudent, onClose, studentToEdit, batchId }) => {
    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        enrollmentNo: '',
        emailId: '',
        batchstartDate: '',
        startDate: '',
        endDate: '',
        batchId: batchId || '', // Set batchId from prop
    });

    useEffect(() => {
        if (studentToEdit) {
            setStudent({ ...studentToEdit, batchId });
        }
    }, [studentToEdit, batchId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log('Submitting student data:', student);
        if (studentToEdit) {
            // Edit student
            await axios.put(`${APP}/api/student/${studentToEdit._id}`, student);
            console.log('Student updated successfully!');
            window.location.reload();
            // Additional logic
        } else {
            // Add new student
            const response = await axios.post(`${APP}/api/student`, student);
            console.log('Student added successfully:', response.data);
            onAddStudent(response.data);
            window.location.reload();
            // Additional logic
        }

        // Close the form
        onClose();
    } catch (error) {
        console.error('Error submitting form:', error);
        // Handle specific errors or log more details
    }
};

    return (
        <div className="student-detail-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="student-detail-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
                <h2>{studentToEdit ? 'Edit Student' : 'Add Student'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>First Name:</label>
                        <input type="text" name="firstName" value={student.firstName} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={student.lastName} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Enrollment No:</label>
                        <input type="text" name="enrollmentNo" value={student.enrollmentNo} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Email ID:</label>
                        <input type="email" name="emailId" value={student.emailId} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Batch Start Date:</label>
                        <input type="date" name="batchstartDate" value={student.batchstartDate} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Joining Date:</label>
                        <input type="date" name="startDate" value={student.startDate} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>End Date:</label>
                        <input type="date" name="endDate" value={student.endDate} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#ccc', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>{studentToEdit ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentDetail;
