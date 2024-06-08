import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StudentDetail from './StudentDetail';

const BatchDetail = () => {
    const { batchId } = useParams();
    const [batch, setBatch] = useState({});
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showStudentDetail, setShowStudentDetail] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);

    useEffect(() => {
        // Fetch batch details
        const fetchBatchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/batch/${batchId}`);
                setBatch(response.data);
            } catch (error) {
                console.error('Error fetching batch details:', error);
            }
        };

        // Fetch students in the batch
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/students/${batchId}`);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchBatchDetails();
        fetchStudents();
    }, [batchId]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const sortedData = [...students].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter(student =>
        student.firstName.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = rowsPerPage === -1 ? filteredData : filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    style={{
                        padding: '5px 10px',
                        border: 'none',
                        backgroundColor: currentPage === i ? '#007bff' : '#ddd',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    const handleEditStudent = (student) => {
        setStudentToEdit(student);
        setShowStudentDetail(true);
    };

    const handleDeleteStudent = async (enrollmentNo) => {
        try {
            await axios.delete(`http://localhost:7000/api/students/${enrollmentNo}`);
            setStudents(students.filter(student => student.enrollmentNo !== enrollmentNo));
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const handleAddStudentClick = () => {
        setStudentToEdit(null);
        setShowStudentDetail(true);
    };

    const handleAddStudent = (newStudent) => {
        setStudents([...students, newStudent]);
        setShowStudentDetail(false);
    };

    const handleSave = (updatedStudent) => {
        setStudents(students.map(student => student.enrollmentNo === updatedStudent.enrollmentNo ? updatedStudent : student));
        setShowStudentDetail(false);
    };

    const handleCancel = () => {
        setShowStudentDetail(false);
    };

    const handleCloseStudentDetail = () => {
        setShowStudentDetail(false);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ marginBottom: '20px' }}>
                <div className="pagetitle" style={{ marginBottom: '20px' }}>
                    <h1>{batch.name}</h1>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{batch.name}</h5>
                                    <p>{batch.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="search-sort-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label>
                        <select
                            style={{ marginLeft: '10px', padding: '5px' }}
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="-1">All</option>
                        </select> entries per page
                    </label>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by First Name"
                        value={search}
                        onChange={handleSearch}
                        style={{ padding: '5px' }}
                    />
                </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('firstName')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>First Name</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('lastName')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>Last Name</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('enrollmentNo')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>Enrollment No.</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('emailId')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>Email ID</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('password')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>Password</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('startDate')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>Start Date</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', cursor: 'pointer' }} onClick={() => handleSort('endDate')}>
                            <button style={{ all: 'unset', cursor: 'pointer' }}>End Date</button>
                        </th>
                        <th style={{ backgroundColor: '#f2f2f2', padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((student, index) => (
                        <tr key={index} style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.firstName}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.lastName}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.enrollmentNo}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.emailId}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.password}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.startDate}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{student.endDate}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-around' }}>
                                <button onClick={() => handleEditStudent(student)} style={{ all: 'unset', cursor: 'pointer', color: '#007bff' }}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeleteStudent(student.enrollmentNo)} style={{ all: 'unset', cursor: 'pointer', color: 'red' }}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: '14px' }}>
                    Showing {indexOfFirstRow + 1} to {indexOfLastRow} of {filteredData.length} entries
                </div>
                <nav style={{ display: 'flex' }}>
                    <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                        <li style={{ margin: '0 5px', ...(currentPage === 1 ? { display: 'none' } : {}) }}>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    border: 'none',
                                    backgroundColor: currentPage === 1 ? '#ddd' : '#007bff',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>
                        </li>
                        {renderPageNumbers()}
                        <li style={{ margin: '0 5px', ...(currentPage === totalPages ? { display: 'none' } : {}) }}>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    border: 'none',
                                    backgroundColor: currentPage === totalPages ? '#ddd' : '#007bff',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                ›
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                    onClick={handleAddStudentClick}
                >
                    Add Student
                </button>
            </div>
            {showStudentDetail && (
                <StudentDetail
                    onAddStudent={handleAddStudent}
                    onClose={handleCloseStudentDetail}
                    studentToEdit={studentToEdit}
                />
            )}
        </div>
    );
};

export default BatchDetail;
