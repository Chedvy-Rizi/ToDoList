import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {Username: username, Password:password });
      localStorage.setItem("token", res.data.token);
      onLogin();
      navigate("/"); // ✅ מפנה לדף הראשי
    } catch (err) {
      console.error("Login error details:", err);
      if (err.response) {
        alert(`Login failed: ${err.response.status} - ${err.response.data}`);
      } else {
        alert("Login failed: Network Error or Server Down");
      }
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px'
        }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            placeholder="Username" 
            type="email" 
            onChange={e => setUsername(e.target.value)}
            style={{
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <input 
            placeholder="Password" 
            type="password" 
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              transition: 'border-color 0.3s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
          <button style={{
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >Login</button>
        </form>
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#666'
        }}>
          Don't have an account? <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;