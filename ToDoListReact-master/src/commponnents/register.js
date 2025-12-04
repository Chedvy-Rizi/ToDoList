// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Password } from "@mui/icons-material";

// export default function Register({ onRegister }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5098/register", { Username: email.toLowerCase(),Password: password });
//       localStorage.setItem("token", res.data.token);
//       onRegister();
//       navigate("/");
//     } catch (err) {
//       alert("המייל כבר קיים או הרשמה נכשלה");
//     }
//   };

//   return (
//     <form onSubmit={handleRegister}>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">הרשמה</button>
//       <button type="button" onClick={() => navigate("/login")}>
//         יש לך כבר חשבון? התחברות
//       </button>
//     </form>
//   );
// }



// src/register.js
import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        Username: username,
        Password: password,
      });
      
      // שמירת הטוקן
      localStorage.setItem("token", res.data.token);

      // עדכון ה־state באפליקציה
      onLogin();

      // הפניה לדף הראשי
      navigate("/");
    } catch (err) {
      console.error("❌ Register failed:", err);
      alert("Register failed, please try again");
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
    }}>Register</h2>
    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input 
        placeholder="Username" 
        type="email" 
        onChange={(e) => setUsername(e.target.value)}
        value={username}
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
        onChange={(e) => setPassword(e.target.value)}
        value={password}
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
      type="submit"
      >
        Register
      </button>
    </form>
    <p style={{
      textAlign: 'center',
      marginTop: '20px',
      color: '#666'
    }}>
      Already have an account? <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
    </p>
  </div>
</div> );
}

export default Register;