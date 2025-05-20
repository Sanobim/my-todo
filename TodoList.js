import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes, FaFlag, FaCalendar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function TodoList({ todos, onDelete, onToggleComplete, onEdit, darkMode = false, username = '', onLogout }) {
  const isPastDue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const priorityColors = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500'
  };
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [filter, setFilter] = useState('all');

  // Placeholder for potential future use

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  const handleEditStart = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
    setEditPriority(todo.priority || 'Medium');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
  };

  const handleEditSubmit = (todo) => {
    onEdit(todo._id, { 
      text: editText,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
    });
    setEditingId(null);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {['all', 'completed', 'incomplete'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === filterType 
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white') 
                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Count */}
      <div className={`text-center mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {filteredTodos.length} task{filteredTodos.length !== 1 ? 's' : ''} {filter !== 'all' && `(${filter})`}
      </div>

      <AnimatePresence>
        <ul className="space-y-3">
          {filteredTodos.map(todo => (
            <motion.li
              key={todo._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`
                flex items-center justify-between p-4 rounded-xl shadow-soft transition-all duration-300 transform hover:scale-[1.02]
                ${todo.completed 
                  ? (darkMode 
                    ? 'bg-green-900 bg-opacity-50 backdrop-blur-sm border-l-4 border-green-600 text-green-200' 
                    : 'bg-green-50 border-l-4 border-green-500') 
                  : (darkMode 
                    ? 'bg-gray-700 bg-opacity-50 backdrop-blur-sm hover:bg-gray-600 text-gray-100' 
                    : 'bg-white bg-opacity-70 backdrop-blur-sm hover:bg-brand-50')}
              `}
            >
              {editingId === todo._id ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className={`
                        flex-grow p-2 rounded-lg transition-all duration-300
                        ${darkMode 
                          ? 'bg-gray-600 text-white' 
                          : 'bg-brand-50 text-gray-800'}
                        focus:outline-none focus:ring-2 focus:ring-brand-500
                      `}
                    />
                    <button
                      onClick={() => handleEditSubmit(todo)}
                      className="text-green-500 hover:bg-green-100 p-2 rounded-full"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Additional Edit Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Due Date */}
                    <div className="flex items-center space-x-2">
                      <FaCalendar className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                      <input 
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className={`
                          w-full p-2 rounded-lg transition-all duration-300
                          ${darkMode 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-brand-50 text-gray-800'}
                          focus:outline-none focus:ring-2 focus:ring-brand-500
                        `}
                      />
                    </div>

                    {/* Priority */}
                    <div className="flex items-center space-x-2">
                      <FaFlag className={`
                        ${priorityColors[editPriority]} 
                        ${darkMode ? 'opacity-70' : ''}
                      `} />
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className={`
                          w-full p-2 rounded-lg transition-all duration-300
                          ${darkMode 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-brand-50 text-gray-800'}
                          focus:outline-none focus:ring-2 focus:ring-brand-500
                        `}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow">
                  <div
                    onClick={() => onToggleComplete(todo._id)}
                    className={`
                      cursor-pointer 
                      ${todo.completed ? 'line-through text-gray-500' : ''}
                      ${isPastDue(todo.dueDate) && !todo.completed ? 'text-red-500' : ''}
                    `}
                  >
                    {todo.text}
                  </div>
                  {todo.description && (
                    <p className={`
                      text-sm mt-1 
                      ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                      {todo.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1 text-sm">
                    {/* Due Date */}
                    <div className="flex items-center space-x-1">
                      <FaCalendar 
                        className={`
                          ${isPastDue(todo.dueDate) && !todo.completed ? 'text-red-500' : ''}
                          ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                        `} 
                      />
                      <span className={`
                        ${isPastDue(todo.dueDate) && !todo.completed ? 'text-red-500' : ''}
                        ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                      `}>
                        {formatDate(todo.dueDate)}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center space-x-1">
                      <FaFlag 
                        className={`
                          ${priorityColors[todo.priority]} 
                          ${darkMode ? 'opacity-70' : ''}
                        `} 
                      />
                      <span className={`
                        ${darkMode ? 'text-gray-400' : 'text-gray-600'}
                      `}>
                        {todo.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {editingId !== todo._id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditStart(todo)}
                    className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(todo._id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  );
}

export default TodoList;
