import React, { useState, useEffect } from 'react';

const StudentDetail = ({ onAddStudent, onClose, studentToEdit, batchName }) => {
    const [student, setStudent] = useState({
        firstName: '',
        lastName: '',
        enrollmentNo: '',
        emailId: '',
        password: '',
        startDate: '',
        endDate: '',
        batchName: batchName || '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (studentToEdit) {
            setStudent(studentToEdit);
        }
    }, [studentToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const validate = () => {
        const errors = {};
        if (!student.firstName) errors.firstName = 'First Name is required';
        if (!student.lastName) errors.lastName = 'Last Name is required';
        if (!student.enrollmentNo) errors.enrollmentNo = 'Enrollment No. is required';
        if (!student.emailId) errors.emailId = 'Email Id is required';
        if (!student.password) errors.password = 'Password is required';
        if (!student.startDate) errors.startDate = 'Start Date is required';
        if (!student.endDate) errors.endDate = 'End Date is required';
        if (!student.batchName) errors.batchName = 'Batch Name is required';
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        onAddStudent(student);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>{studentToEdit ? 'Edit Student' : 'Add Student'}</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>First Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="firstName"
                            value={student.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <div style={styles.error}>{errors.firstName}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Last Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="lastName"
                            value={student.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <div style={styles.error}>{errors.lastName}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Enrollment No.</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="enrollmentNo"
                            value={student.enrollmentNo}
                            onChange={handleChange}
                        />
                        {errors.enrollmentNo && <div style={styles.error}>{errors.enrollmentNo}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Id</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="emailId"
                            value={student.emailId}
                            onChange={handleChange}
                        />
                        {errors.emailId && <div style={styles.error}>{errors.emailId}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            value={student.password}
                            onChange={handleChange}
                        />
                        {errors.password && <div style={styles.error}>{errors.password}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Start Date</label>
                        <input
                            style={styles.input}
                            type="date"
                            name="startDate"
                            value={student.startDate}
                            onChange={handleChange}
                        />
                        {errors.startDate && <div style={styles.error}>{errors.startDate}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>End Date</label>
                        <input
                            style={styles.input}
                            type="date"
                            name="endDate"
                            value={student.endDate}
                            onChange={handleChange}
                        />
                        {errors.endDate && <div style={styles.error}>{errors.endDate}</div>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Batch Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="batchName"
                            value={student.batchName}
                            onChange={handleChange}
                            readOnly={!!batchName}
                        />
                        {errors.batchName && <div style={styles.error}>{errors.batchName}</div>}
                    </div>
                    <div style={styles.buttonContainer}>
                        <button type="submit" style={styles.buttonPrimary}>
                            {studentToEdit ? 'Save' : 'Add'}
                        </button>
                        <button type="button" onClick={onClose} style={styles.buttonSecondary}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif'
    },
    title: {
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    formGroup: {
        marginBottom: '15px'
    },
    label: {
        marginBottom: '5px'
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '20px'
    },
    buttonPrimary: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '10px'
    },
    buttonSecondary: {
        padding: '10px 20px',
        backgroundColor: '#ccc',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    error: {
        color: 'red',
        fontSize: '12px'
    }
};

export default StudentDetail;
