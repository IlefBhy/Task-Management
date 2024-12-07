import React, { useState, useEffect } from 'react';
import { format } from 'date-fns'; // For formatting dates

export default function TaskList({ onEditClick }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users to get the names
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users'); // Replace with your API endpoint to fetch users
        const data = await response.json();
        setUsers(data); // Store the users data for later use
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Replace with your API endpoint to fetch tasks
        const data = await response.json();
        setTasks(data); // Assuming the response includes userId, createdAt, updatedAt
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Function to get the user name by userId
  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Task List</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border border-gray-300 rounded-md flex flex-col space-y-2 hover:bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg text-gray-700">{task.name}</span>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-md ${
                  task.status === 'en cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}
              >
                {task.status === 'en cours' ? 'In Progress' : 'Completed'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <p>
                <strong>Created At:</strong>{' '}
                {task.createdAt ? format(new Date(task.createdAt), 'PPPpp') : 'N/A'}
              </p>
              <p>
                <strong>Updated At:</strong>{' '}
                {task.updatedAt ? format(new Date(task.updatedAt), 'PPPpp') : 'N/A'}
              </p>
              <p>
                <strong>Assigned To:</strong> {getUserName(task.userId)}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => onEditClick(task)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
