import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import logo from '../img/coachifylogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const APP = process.env.REACT_APP_API_URL;

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    enrollmentNo: '',
    emailId: '',
    startDate: '',
    endDate: '',
    batchId: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (studentData.batchId) {
      const encodedUsername = encodeURIComponent(formData.username);
      navigate(`/${encodedUsername}/${studentData.batchId}`);
    }
  }, [studentData, navigate, formData.username]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = formData;

    try {
      const response = await axios.post(`${APP}/api/auth/student_login`, { username, password });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);

      const studentResponse = await axios.get(`${APP}/api/student/username/${username}`);
      console.log('Fetched student data:', studentResponse.data); // Debug log
      setStudentData(studentResponse.data);

    } catch (error) {
      console.error('Error response:', error.response); // Log the error response
      setError(error.response?.data.message || 'Server error');
    }
  };

  return (
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a href="#" className="logo d-flex align-items-center w-auto">
                  <img src={logo} alt="logo" />
                </a>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    <p className="text-center small">Enter your username & password to login</p>
                  </div>
                  <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username
                      </label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">
                          @
                        </span>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="yourUsername"
                          required
                          onChange={handleChange}
                        />
                        <div className="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        required
                        onChange={handleChange}
                      />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Login
                      </button>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentLogin;
