import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaCalendar, FaFlag } from 'react-icons/fa';

function TodoForm({ onAdd, darkMode = false }) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    onAdd({
      text,
      description,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority
    });
    
    // Reset form
    setText('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setIsExpanded(false);
  };

  const priorityColors = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500'
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        mb-6 space-y-4 p-4 rounded-xl shadow-soft
        ${darkMode 
          ? 'bg-gray-700 bg-opacity-50 backdrop-blur-sm' 
          : 'bg-white bg-opacity-70 backdrop-blur-sm'
        }
      `}
    >
      <div className="flex items-center space-x-2">
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task title"
          required
          className={`
            flex-grow p-3 rounded-lg transition-all duration-300
            ${darkMode 
              ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-brand-500' 
              : 'bg-brand-50 text-gray-800 placeholder-gray-500 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-2
          `}
        />
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            p-3 rounded-lg transition-all duration-300 flex items-center justify-center
            ${darkMode 
              ? 'bg-brand-700 text-white hover:bg-brand-600' 
              : 'bg-brand-500 text-white hover:bg-brand-600'
            }
          `}
        >
          <FaPlus />
        </motion.button>
      </div>

      {/* Description Toggle */}
      <div className="flex justify-center">
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center space-x-2 text-sm py-1 px-3 rounded-full transition-all duration-300
            ${darkMode 
              ? 'text-gray-300 hover:bg-gray-600' 
              : 'text-gray-600 hover:bg-brand-100'
            }
          `}
        >
          <FaEdit />
          <span>{isExpanded ? 'Hide Description' : 'Add Description'}</span>
        </button>
      </div>

      {/* Animated Description */}
            {/* Additional Task Details */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Due Date */}
        <div className="flex items-center space-x-2">
          <FaCalendar className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          <input 
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`
              w-full p-2 rounded-lg transition-all duration-300
              ${darkMode 
                ? 'bg-gray-600 text-white placeholder-gray-400' 
                : 'bg-brand-50 text-gray-800 placeholder-gray-500'}
              focus:outline-none focus:ring-2 focus:ring-brand-500
            `}
          />
        </div>

        {/* Priority */}
        <div className="flex items-center space-x-2">
          <FaFlag className={`
            ${priorityColors[priority]} 
            ${darkMode ? 'opacity-70' : ''}
          `} />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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

      {isExpanded && (
        <motion.textarea 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional task details..."
          className={`
            w-full p-3 rounded-lg transition-all duration-300
            ${darkMode 
              ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-brand-500' 
              : 'bg-brand-50 text-gray-800 placeholder-gray-500 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-2
          `}
          rows="2"
        />
      )}
    </motion.form>
  );
}

export default TodoForm;
