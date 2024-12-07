import { useState, useEffect } from 'react';

export default function AddTaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('en cours');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);  // Loading state for users

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userList = await response.json();
        console.log('Fetched users:', userList); // Debug: Check fetched user data
        setUsers(userList);
        setIsLoading(false); // Set loading to false after users are fetched
      } else {
        console.error('Failed to fetch users');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    console.log('Selected User ID:', selectedUserId); // Debug: Check selected user ID

    // Check if a valid user is selected
    const selectedUser = users.find(user => user.id === selectedUserId);

    console.log('Selected User:', selectedUser); // Debug: Check selected user

    if (false &&!selectedUser) {
      setErrorMessage('Please select a valid user.');
      return;
    }

    const newTask = {
      name: taskName,
      status: taskStatus,
      userId: parseInt(selectedUserId)??0,
      userFirstName: selectedUser?.firstName,
      userLastName: selectedUser?.lastName
    };

    console.log('New Task:', newTask); // Debug: Check new task object before submission

    const response = await fetch('/api/tasks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const addedTask = await response.json();
      onAddTask(addedTask);
      setSuccessMessage('Task added successfully!');
      setTaskName('');
      setTaskStatus('en cours');
      setSelectedUserId('');
    } else {
      setErrorMessage('Failed to add task. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 bg-white shadow-xl rounded-lg max-w-lg mx-auto relative"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Add New Task</h2>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="taskName" className="text-sm font-medium text-gray-600">Task Name</label>
        <input
          id="taskName"
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="taskStatus" className="text-sm font-medium text-gray-600">Task Status</label>
        <select
          id="taskStatus"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
          className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="en cours">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="user" className="text-sm font-medium text-gray-600">Assign User</label>
        <select
          id="user"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        
          className="px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">Select User</option>
          {isLoading ? (
            <option>Loading users...</option>
          ) : (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))
          )}
        </select>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-2 px-4 border border-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          Add Task
        </button>
      </div>
      {successMessage && (
        <p className="text-green-500 text-sm mt-4">{successMessage}</p>
      )}
    </form>
  );
}
