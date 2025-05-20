import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      // Validate token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUsername(storedUsername || '');
    }
  }, []);

  const handleLogin = (token, userUsername) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', userUsername);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUsername(userUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUsername('');
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        const sortedTodos = sortTodos(response.data);
        setTodos(sortedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  // Sorting function for todos
  const sortTodos = (todosToSort) => {
    // Priority order: High > Medium > Low
    const priorityOrder = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    return todosToSort.sort((a, b) => {
      // First, sort by priority (descending)
      const priorityComparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityComparison !== 0) return priorityComparison;

      // If priority is the same, sort by due date (ascending)
      // Uncompleted tasks with due dates come first
      const aDate = a.dueDate ? new Date(a.dueDate) : null;
      const bDate = b.dueDate ? new Date(b.dueDate) : null;

      // Completed tasks go to the end
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Compare due dates
      if (aDate && bDate) return aDate - bDate;
      if (aDate) return -1;
      if (bDate) return 1;

      // If no due dates, maintain original order
      return 0;
    });
  };

  // Add new todo
  const addTodo = async (todoData) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTodo = {
        ...todoData,
        dueDate: todoData.dueDate ? new Date(todoData.dueDate).toISOString() : null
      };
      const response = await axios.post('http://localhost:5000/api/todos', formattedTodo);
      const updatedTodos = sortTodos([response.data, ...todos]);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const todoToToggle = todos.find(todo => todo._id === id);
      if (!todoToToggle) {
        console.error('Todo not found');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !todoToToggle.completed
      });
      const updatedTodos = sortTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Edit existing todo
  const editTodo = async (id, updatedTodo) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTodo = {
        ...updatedTodo,
        dueDate: updatedTodo.dueDate ? new Date(updatedTodo.dueDate).toISOString() : null
      };
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, formattedTodo);
      const updatedTodos = sortTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };



  return (
    <Router>
      <div className={`
        min-h-screen font-sans
        ${darkMode ? 'bg-gray-900 text-white' : 'bg-soft-blue'} 
        py-6 flex flex-col justify-center sm:py-12
      `}>
        {/* Dark Mode and Logout Toggles */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className={`
                p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-soft
                ${darkMode 
                  ? 'bg-red-700 text-white hover:bg-red-600' 
                  : 'bg-red-500 text-white hover:bg-red-600'}
              `}
            >
              <FaSignOutAlt />
            </button>
          )}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`
              p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-soft
              ${darkMode 
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
                : 'bg-brand-100 text-brand-600 hover:bg-brand-200'
              }
            `}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <Login onLogin={handleLogin} darkMode={darkMode} /> : 
                <Navigate to="/todos" />
            } 
          />
          <Route 
            path="/signup" 
            element={
              !isAuthenticated ? 
                <Signup onSignup={handleLogin} darkMode={darkMode} /> : 
                <Navigate to="/todos" />
            } 
          />
          <Route 
            path="/todos" 
            element={
              isAuthenticated ? (
                <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4">
                  {/* Hero Header */}
                  <div className={`
                    mb-8 p-6 rounded-2xl shadow-glass text-center relative
                    ${darkMode 
                      ? 'bg-gray-800 bg-opacity-70 backdrop-blur-sm' 
                      : 'bg-white bg-opacity-70 backdrop-blur-sm'}
                  `}>
                    <h1 className={`
                      text-4xl font-bold mb-2 tracking-tight
                      ${darkMode ? 'text-brand-200' : 'text-brand-700'}
                    `}>
                      Stay Focused, Stay Organized
                    </h1>
                    <p className={`
                      text-lg mb-4
                      ${darkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      Welcome, {username}
                    </p>
                  </div>

                  {/* Main App Container */}
                  <div className={`
                    relative rounded-3xl shadow-glass overflow-hidden
                    ${darkMode 
                      ? 'bg-gray-800 bg-opacity-70 backdrop-blur-sm' 
                      : 'bg-white bg-opacity-70 backdrop-blur-sm'}
                  `}>
                    <div className="max-w-md mx-auto p-6">
                      <TodoForm onAdd={addTodo} darkMode={darkMode} />
                      <TodoList 
                        todos={todos} 
                        onDelete={deleteTodo} 
                        onToggleComplete={toggleTodo} 
                        onEdit={editTodo}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/todos" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
