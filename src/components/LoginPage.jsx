import React, { useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import './LoginPage.css'; 

export const LoginPage = () => {
  let navigate = useNavigate();
    const [userid, setuserid] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user_signin', {
        userid,
        password
      });

      if(response.status){
        localStorage.setItem("token",response.token);
        localStorage.setItem("userid",userid);
        navigate('/chat');
      }
      // Handle success (save token, redirect, etc.)
      console.log('Login Success:', response.data);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };
  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>userid:</label>
            <input
              type="string"
              value={userid}
              onChange={(e) => setuserid(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </>
  );
};
