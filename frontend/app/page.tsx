"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

type Task = {
  id?: string | number;
  _id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const GUEST_NAME_KEY = "guestName";
const DARK_MODE_KEY = "darkMode";

export default function Home() {
  // =====================================================
  // GENERAL
  // =====================================================

  const [darkMode, setDarkMode] = useState(false);

  const [guestName, setGuestName] =
    useState("Guest");

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  // =====================================================
  // PROFILE
  // =====================================================

  const [showProfile, setShowProfile] =
    useState(false);

  const [profileName, setProfileName] =
    useState("");

  const [profileError, setProfileError] =
    useState("");

  // =====================================================
  // ADD / EDIT TASK FORM
  // =====================================================

  const [showAddTask, setShowAddTask] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("Todo");

  const [priority, setPriority] =
    useState("Medium");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // EDIT TASK
  // =====================================================

  const [showEditTask, setShowEditTask] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  // =====================================================
  // DELETE
  // =====================================================

  const [isDeleting, setIsDeleting] =
    useState(false);

  // =====================================================
  // LOAD SAVED USER SETTINGS
  // =====================================================

  useEffect(() => {
    try {
      const savedName =
        localStorage.getItem(
          GUEST_NAME_KEY,
        );

      if (
        savedName &&
        savedName.trim()
      ) {
        setGuestName(
          savedName.trim(),
        );
      }

      const savedDarkMode =
        localStorage.getItem(
          DARK_MODE_KEY,
        );

      if (
        savedDarkMode === "true"
      ) {
        setDarkMode(true);
      }
    } catch (error) {
      console.error(
        "Failed to load saved settings:",
        error,
      );
    }
  }, []);

  // =====================================================
  // DARK MODE PERSISTENCE
  // =====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        DARK_MODE_KEY,
        String(darkMode),
      );
    } catch (error) {
      console.error(
        "Failed to save dark mode:",
        error,
      );
    }
  }, [darkMode]);

  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const openProfile = () => {
    setProfileName(guestName);
    setProfileError("");
    setShowProfile(true);
  };

  // =====================================================
  // CLOSE PROFILE
  // =====================================================

  const closeProfile = () => {
    setShowProfile(false);
    setProfileName("");
    setProfileError("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedName =
      profileName.trim();

    if (!trimmedName) {
      setProfileError(
        "Please enter your name.",
      );
      return;
    }

    if (trimmedName.length > 50) {
      setProfileError(
        "Name must be 50 characters or less.",
      );
      return;
    }

    try {
      localStorage.setItem(
        GUEST_NAME_KEY,
        trimmedName,
      );

      setGuestName(trimmedName);

      setProfileError("");

      setShowProfile(false);
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error,
      );

      setProfileError(
        "Unable to save your name. Please try again.",
      );
    }
  };

  // =====================================================
  // GET ALL TASKS
  // =====================================================

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setPageError("");

      const response = await fetch(
        `${API_URL}/tasks`,
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch tasks",
        );
      }

      const data =
        await response.json();

      const formattedTasks: Task[] =
        Array.isArray(data)
          ? data.map(
              (task: Task) => ({
                ...task,
                id:
                  task.id ??
                  task._id,
              }),
            )
          : [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error(
        "Failed to load tasks:",
        error,
      );

      setPageError(
        "Unable to load tasks. Please make sure the backend is running.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // LOAD TASKS ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    loadTasks();
  }, []);

  // =====================================================
  // TOGGLE TASK STATUS
  // =====================================================

  const toggleTask = async (
    task: Task,
  ) => {
    const taskId =
      task.id ?? task._id;

    if (!taskId) {
      console.error(
        "Task ID is missing",
      );
      return;
    }

    const newStatus =
      task.status === "Done"
        ? "Todo"
        : "Done";

    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Update error:",
          response.status,
          errorText,
        );

        throw new Error(
          "Failed to update task",
        );
      }

      const updatedTask =
        await response.json();

      const formattedTask: Task = {
        ...updatedTask,
        id:
          updatedTask.id ??
          updatedTask._id,
      };

      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (currentTask) => {
              const currentTaskId =
                currentTask.id ??
                currentTask._id;

              return String(
                currentTaskId,
              ) === String(taskId)
                ? formattedTask
                : currentTask;
            },
          ),
      );
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      alert(
        "Failed to update task.",
      );
    }
  };

  // =====================================================
  // CREATE TASK
  // =====================================================

  const handleAddTask = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(
        "Task title is required.",
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Task description is required.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
            status,
            priority,
          }),
        },
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Create task error:",
          response.status,
          errorText,
        );

        throw new Error(
          "Failed to create task",
        );
      }

      const createdTask =
        await response.json();

      const formattedTask: Task = {
        ...createdTask,
        id:
          createdTask.id ??
          createdTask._id,
      };

      setTasks(
        (currentTasks) => [
          formattedTask,
          ...currentTasks,
        ],
      );

      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      setError("");

      setShowAddTask(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error,
      );

      setError(
        "Failed to create task. Please check that the backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // OPEN EDIT TASK
  // =====================================================

  const openEditTask = (
    task: Task,
  ) => {
    setEditingTask(task);

    setTitle(task.title);
    setDescription(
      task.description,
    );
    setStatus(task.status);
    setPriority(task.priority);

    setEditError("");

    setShowEditTask(true);
  };

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const handleEditTask = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingTask) {
      return;
    }

    const taskId =
      editingTask.id ??
      editingTask._id;

    if (!taskId) {
      setEditError(
        "Task ID is missing.",
      );
      return;
    }

    if (!title.trim()) {
      setEditError(
        "Task title is required.",
      );
      return;
    }

    if (!description.trim()) {
      setEditError(
        "Task description is required.",
      );
      return;
    }

    try {
      setIsUpdating(true);
      setEditError("");

      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
            status,
            priority,
          }),
        },
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Update task error:",
          response.status,
          errorText,
        );

        throw new Error(
          "Failed to update task",
        );
      }

      const updatedTask =
        await response.json();

      const formattedTask: Task = {
        ...updatedTask,
        id:
          updatedTask.id ??
          updatedTask._id,
      };

      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (currentTask) => {
              const currentTaskId =
                currentTask.id ??
                currentTask._id;

              return String(
                currentTaskId,
              ) === String(taskId)
                ? formattedTask
                : currentTask;
            },
          ),
      );

      setShowEditTask(false);
      setEditingTask(null);

      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      setEditError("");
    } catch (error) {
      console.error(
        "Failed to update task:",
        error,
      );

      setEditError(
        "Failed to update task. Please check that the backend is running.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    if (isUpdating) {
      return;
    }

    setShowEditTask(false);
    setEditingTask(null);

    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");

    setEditError("");
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const deleteTask = async (
    task: Task,
  ) => {
    const taskId =
      task.id ?? task._id;

    if (!taskId) {
      console.error(
        "Task ID is missing",
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${task.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Delete error:",
          response.status,
          errorText,
        );

        throw new Error(
          "Failed to delete task",
        );
      }

      setTasks(
        (currentTasks) =>
          currentTasks.filter(
            (currentTask) => {
              const currentTaskId =
                currentTask.id ??
                currentTask._id;

              return (
                String(
                  currentTaskId,
                ) !==
                String(taskId)
              );
            },
          ),
      );
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error,
      );

      alert(
        "Failed to delete task.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const openAddTaskModal = () => {
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setError("");

    setShowAddTask(true);
  };

  // =====================================================
  // CLOSE ADD MODAL
  // =====================================================

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setShowAddTask(false);

    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setError("");
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTasks =
    tasks.length;

  const todoTasks =
    tasks.filter(
      (task) =>
        task.status === "Todo",
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress",
    ).length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "Done",
    ).length;

  // =====================================================
  // PROFILE INITIAL
  // =====================================================

  const profileInitial =
    guestName
      .trim()
      .charAt(0)
      .toUpperCase() || "G";

  // =====================================================
  // UI
  // =====================================================

  return (
    <main
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="flex min-h-screen">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar
          darkMode={darkMode}
          activePage="dashboard"
        />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <section className="flex-1">

          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className={`flex h-16 items-center justify-between border-b px-4 md:px-8 ${
              darkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">
                Task Management
              </h2>

              <p className="text-xs text-slate-500">
                Manage your tasks efficiently
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* DARK MODE */}

              <button
                type="button"
                onClick={() =>
                  setDarkMode(
                    (current) =>
                      !current,
                  )
                }
                className={`rounded-lg border px-3 py-2 text-sm ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                {darkMode
                  ? "☀️ Light"
                  : "🌙 Dark"}
              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={openProfile}
                aria-label="Open guest profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {profileInitial}
              </button>
            </div>
          </header>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <div className="p-4 md:p-8">

            {/* WELCOME */}

            <div className="mb-8">
              <h3 className="text-2xl font-bold">
                Welcome, {guestName} 👋
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Here is an overview of your tasks.
              </p>
            </div>

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* TOTAL */}

              <div
                className={`rounded-xl border p-5 shadow-sm ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-500">
                  Total Tasks
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalTasks}
                </p>
              </div>

              {/* TODO */}

              <div
                className={`rounded-xl border p-5 shadow-sm ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-500">
                  Todo
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {todoTasks}
                </p>
              </div>

              {/* IN PROGRESS */}

              <div
                className={`rounded-xl border p-5 shadow-sm ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-500">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {inProgressTasks}
                </p>
              </div>

              {/* COMPLETED */}

              <div
                className={`rounded-xl border p-5 shadow-sm ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {completedTasks}
                </p>
              </div>
            </div>

            {/* =================================================
                TASK LIST
            ================================================= */}

            <div
              className={`rounded-xl border shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >

              {/* TASK HEADER */}

              <div
                className={`flex items-center justify-between border-b p-5 ${
                  darkMode
                    ? "border-slate-800"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <h3 className="font-semibold">
                    My Tasks
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your current tasks
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    openAddTaskModal
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  + Add Task
                </button>
              </div>

              {/* TASKS */}

              <div
                className={`divide-y ${
                  darkMode
                    ? "divide-slate-800"
                    : "divide-slate-200"
                }`}
              >

                {/* LOADING */}

                {isLoading && (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Loading tasks...
                  </div>
                )}

                {/* ERROR */}

                {!isLoading &&
                  pageError && (
                    <div className="p-8 text-center">

                      <p className="text-sm text-red-600">
                        {pageError}
                      </p>

                      <button
                        type="button"
                        onClick={loadTasks}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                {/* TASK ITEMS */}

                {!isLoading &&
                  !pageError &&
                  tasks.map(
                    (task) => {
                      const taskId =
                        task.id ??
                        task._id;

                      return (
                        <div
                          key={String(
                            taskId,
                          )}
                          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >

                          {/* LEFT */}

                          <div className="flex items-start gap-3">

                            <input
                              type="checkbox"
                              checked={
                                task.status ===
                                "Done"
                              }
                              onChange={() =>
                                toggleTask(
                                  task,
                                )
                              }
                              className="mt-1 h-4 w-4 cursor-pointer"
                            />

                            <div>
                              <h4
                                className={`font-medium ${
                                  task.status ===
                                  "Done"
                                    ? "text-slate-400 line-through"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </h4>

                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  task.description
                                }
                              </p>
                            </div>
                          </div>

                          {/* RIGHT */}

                          <div className="flex flex-wrap items-center gap-2">

                            {/* PRIORITY */}

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.priority ===
                                "High"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority ===
                                      "Medium"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              {
                                task.priority
                              }
                            </span>

                            {/* STATUS */}

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.status ===
                                "Done"
                                  ? "bg-green-100 text-green-700"
                                  : task.status ===
                                      "In Progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {
                                task.status
                              }
                            </span>

                            {/* EDIT */}

                            <button
                              type="button"
                              disabled={
                                isUpdating
                              }
                              onClick={() =>
                                openEditTask(
                                  task,
                                )
                              }
                              className="rounded-lg px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              disabled={
                                isDeleting
                              }
                              onClick={() =>
                                deleteTask(
                                  task,
                                )
                              }
                              className="rounded-lg px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    },
                  )}

                {/* EMPTY */}

                {!isLoading &&
                  !pageError &&
                  tasks.length === 0 && (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No tasks found. Click{" "}
                      <strong>
                        + Add Task
                      </strong>{" "}
                      to create one.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          ADD TASK MODAL
      ===================================================== */}

      {showAddTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className={`w-full max-w-lg rounded-xl p-6 shadow-xl ${
              darkMode
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }`}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Add New Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new task for your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  isSubmitting
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleAddTask
              }
              className="space-y-4"
            >

              {/* TITLE */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="Enter task title"
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Enter task description"
                  rows={4}
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value,
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>
                </select>
              </div>

              {/* PRIORITY */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Priority
                </label>

                <select
                  value={
                    priority
                  }
                  onChange={(event) =>
                    setPriority(
                      event.target.value,
                    )
                  }
                  disabled={
                    isSubmitting
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              {/* ERROR */}

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    isSubmitting
                  }
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Creating..."
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT TASK MODAL
      ===================================================== */}

      {showEditTask && (
        <div
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >
          <div
            className={`w-full max-w-lg rounded-xl p-6 shadow-xl ${
              darkMode
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }`}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Edit Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your task details.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeEditModal
                }
                disabled={
                  isUpdating
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleEditTask
              }
              className="space-y-4"
            >

              {/* TITLE */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  placeholder="Enter task title"
                  disabled={
                    isUpdating
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Enter task description"
                  rows={4}
                  disabled={
                    isUpdating
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value,
                    )
                  }
                  disabled={
                    isUpdating
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Todo">
                    Todo
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Done">
                    Done
                  </option>
                </select>
              </div>

              {/* PRIORITY */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Priority
                </label>

                <select
                  value={
                    priority
                  }
                  onChange={(event) =>
                    setPriority(
                      event.target.value,
                    )
                  }
                  disabled={
                    isUpdating
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>
              </div>

              {/* ERROR */}

              {editError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {editError}
                </p>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={
                    isUpdating
                  }
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isUpdating
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating
                    ? "Updating..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          GUEST PROFILE MODAL
      ===================================================== */}

      {showProfile && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeProfile();
            }
          }}
        >
          <div
            className={`w-full max-w-md rounded-xl p-6 shadow-2xl ${
              darkMode
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }`}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            {/* PROFILE HEADER */}

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Guest Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Personalize your AbleSpace workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeProfile
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            {/* PROFILE AVATAR */}

            <div className="mb-6 flex justify-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {profileName
                  .trim()
                  .charAt(0)
                  .toUpperCase() ||
                  "G"}
              </div>
            </div>

            {/* PROFILE FORM */}

            <form
              onSubmit={
                handleSaveProfile
              }
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Your Name
                </label>

                <input
                  type="text"
                  value={
                    profileName
                  }
                  onChange={(event) => {
                    setProfileName(
                      event.target.value,
                    );

                    setProfileError(
                      "",
                    );
                  }}
                  placeholder="Enter your name"
                  autoFocus
                  maxLength={50}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* PROFILE ERROR */}

              {profileError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {
                    profileError
                  }
                </p>
              )}

              {/* PROFILE BUTTONS */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    closeProfile
                  }
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}