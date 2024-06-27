import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style.css';
import logo from '../img/coachifylogo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../ContextApi/UserContext'; // Adjust the import path as needed

const APP = process.env.REACT_APP_API_URL;

function Login({ hideCreateAccountButton = false }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const { setUser } = useUser();
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, username, password } = formData;

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${APP}/api/auth/login`, { username, password });
        console.log('Login response:', response.data);
        localStorage.setItem('token', response.data.token);
        // Set the user context with the retrieved user data
        setUser({ username: response.data.username, email: response.data.email });
      } else {
        response = await axios.post(`${APP}/api/auth/register`, { name, email, username, password });
        console.log('Registration response:', response.data);
        localStorage.setItem('token', response.data.token);
        // Set the user context with the retrieved user data
        setUser({ name, email, username });
      }
      // Redirect to the path including the username
      navigate(`/admin/${username}`);
    } catch (error) {
      console.error('Error response:', error.response); // Log the error response
      alert(error.response?.data.msg || 'Server error');
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
                  <img src={logo} />
                  {/* <span className="d-none d-lg-block">NiceAdmin</span> */}
                </a>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      {isLogin ? 'Login to Your Account' : 'Create an Account'}
                    </h5>
                    <p className="text-center small">
                      {isLogin
                        ? 'Enter your username & password to login'
                        : 'Enter your personal details to create account'}
                    </p>
                  </div>
                  <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    {!isLogin && (
                      <div className="col-12">
                        <label htmlFor="yourName" className="form-label">
                          Your Name
                        </label>
                        <input type="text" name="name" className="form-control" id="yourName" required onChange={handleChange} />
                        <div className="invalid-feedback">Please, enter your name!</div>
                      </div>
                    )}
                    {!isLogin && (
                      <div className="col-12">
                        <label htmlFor="yourEmail" className="form-label">
                          Your Email
                        </label>
                        <input type="email" name="email" className="form-control" id="yourEmail" required onChange={handleChange} />
                        <div className="invalid-feedback">Please enter a valid Email address!</div>
                      </div>
                    )}
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username
                      </label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">
                          @
                        </span>
                        <input type="text" name="username" className="form-control" id="yourUsername" required onChange={handleChange} />
                        <div className="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input type="password" name="password" className="form-control" id="yourPassword" required onChange={handleChange} />
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>
                    {!isLogin && (
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            name="terms"
                            type="checkbox"
                            value=""
                            id="acceptTerms"
                            required
                          />
                          <div className="invalid-feedback">You must agree before submitting.</div>
                        </div>
                      </div>
                    )}
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        {isLogin ? 'Login' : 'Create Account'}
                      </button>
                    </div>
                    <div className="col-12">
                      {isLogin && !hideCreateAccountButton && (
                        <p className="small mb-0">
                          <span>
                            Don't have an account? <a href="#" onClick={toggleForm}>Create an account</a>
                          </span>
                        </p>
                      )}
                      {!isLogin && (
                        <p className="small mb-0">
                          <span>
                            Already have an account? <a href="#" onClick={toggleForm}>Log in</a>
                          </span>
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
