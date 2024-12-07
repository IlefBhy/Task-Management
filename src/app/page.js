"use client";

import { useState, useEffect } from "react";
import AddTaskForm from "../../components/AddTaskForm";
import EditTaskForm from "../../components/EditTaskForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Handle adding a task
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowAddModal(false);
    toast.success("Task added successfully!");
  };

  // Handle editing a task
  const handleEditTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setTaskToEdit(null);
    setShowEditModal(false);
    toast.success("Task edited successfully!");
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        toast.success("Task deleted successfully!");
      } else {
        console.error("Failed to delete task:", response.statusText);
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("An error occurred while deleting the task.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        Task Management
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Add Task
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="table-auto w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-200">Task Name</th>
              <th className="px-4 py-2 border border-gray-200">Status</th>
              <th className="px-4 py-2 border border-gray-200">Created At</th>
              <th className="px-4 py-2 border border-gray-200">Updated At</th>
              <th className="px-4 py-2 border border-gray-200">User Name</th>
              <th className="px-4 py-2 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-200">{task.name}</td>
                <td
                  className={`px-4 py-2 border border-gray-200 font-semibold ${
                    task.status === "en cours"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {task.status === "en cours" ? "In Progress" : "Completed"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {new Date(task.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {task.user
                    ? `${task.user.firstName} ${task.user.lastName}`
                    : "N/A"}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setTaskToEdit(task);
                        setShowEditModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>
            <AddTaskForm onAddTask={handleAddTask} />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>
            <EditTaskForm
              task={taskToEdit}
              onSaveChanges={handleEditTask}
              onCancelEdit={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
