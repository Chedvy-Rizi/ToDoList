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
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      // שליחת בקשה לשרת — ודאי שהשרת שלך מאזין לנתיב הזה
      const res = await axios.post("http://localhost:5098/register", {
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Username"
          type="email"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;