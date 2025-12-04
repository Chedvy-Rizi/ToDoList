// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import service from './service.js';
import Login from './commponnents/login.js';
import Register from './commponnents/register.js';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setToken(localStorage.getItem("token"))} />} />
      <Route path="/register" element={<Register onLogin={() => setToken(localStorage.getItem("token"))} />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <TodoPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete, todo.name);
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <section style={{
        maxWidth: '700px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <header style={{
          padding: '24px 32px',
          background: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600', color: '#1a1a1a' }}>Tasks</h1>
            <button onClick={logout} style={{
              background: 'white',
              border: '1px solid #d0d0d0',
              color: '#333',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => e.target.style.background = '#f9f9f9'}
               onMouseOut={(e) => e.target.style.background = 'white'}>
              Logout
            </button>
          </div>
          <form onSubmit={createTodo}>
            <input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d0d0d0',
                borderRadius: '4px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#333'}
              onBlur={(e) => e.target.style.borderColor = '#d0d0d0'}
            />
          </form>
        </header>
        <section style={{ padding: '16px 32px 32px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {console.log(todos)}
            {todos && todos.map(todo => (
              <li key={todo.id} style={{
                background: 'white',
                marginBottom: '8px',
                padding: '16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s'
              }} onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'}
                 onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
                <input
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginRight: '12px',
                    cursor: 'pointer'
                  }}
                />
                <label style={{
                  flex: 1,
                  fontSize: '15px',
                  textDecoration: todo.isComplete ? 'line-through' : 'none',
                  color: todo.isComplete ? '#999' : '#1a1a1a',
                  cursor: 'default'
                }}>{todo.name}</label>
                <button onClick={() => deleteTodo(todo.id)} style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }} onMouseOver={(e) => {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.color = '#e53e3e';
                }}
                   onMouseOut={(e) => {
                     e.target.style.background = 'transparent';
                     e.target.style.color = '#999';
                   }}>×</button>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}

export default App;