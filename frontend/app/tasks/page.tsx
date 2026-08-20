"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TaskModal, {
  TaskFormData,
} from "../components/TaskModal";

type Task = {
  id?: string | number;
  _id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

const API_URL = "http://localhost:5000";

const EMPTY_FORM: TaskFormData = {
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
};

export default function TasksPage() {
  // ==================================================
  // GENERAL
  // ==================================================

  const [darkMode, setDarkMode] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [pageError, setPageError] = useState("");

  // ==================================================
  // FORM
  // ==================================================

  const [formData, setFormData] =
    useState<TaskFormData>({
      ...EMPTY_FORM,
    });

  // ==================================================
  // ADD TASK
  // ==================================================

  const [showAddTask, setShowAddTask] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [addError, setAddError] =
    useState("");

  // ==================================================
  // EDIT TASK
  // ==================================================

  const [showEditTask, setShowEditTask] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState<string | number | null>(null);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  // ==================================================
  // LOAD SAVED THEME
  // ==================================================

  useEffect(() => {
    try {
      const savedDarkMode =
        localStorage.getItem("darkMode");

      if (savedDarkMode === "true") {
        setDarkMode(true);
      } else if (
        savedDarkMode === "false"
      ) {
        setDarkMode(false);
      }
    } catch (error) {
      console.error(
        "Failed to load saved theme:",
        error,
      );
    }
  }, []);

  // ==================================================
  // SAVE THEME
  // ==================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "darkMode",
        String(darkMode),
      );
    } catch (error) {
      console.error(
        "Failed to save theme:",
        error,
      );
    }
  }, [darkMode]);

  // ==================================================
  // TOGGLE THEME
  // ==================================================

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleFormChange = (
    field: keyof TaskFormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ==================================================
  // GET ALL TASKS
  // ==================================================

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

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid task data received from server",
        );
      }

      const formattedTasks: Task[] =
        data.map((task: Task) => ({
          ...task,
          id: task.id ?? task._id,
        }));

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

  // ==================================================
  // LOAD TASKS ON PAGE LOAD
  // ==================================================

  useEffect(() => {
    loadTasks();
  }, []);

  // ==================================================
  // TOGGLE TASK STATUS
  // ==================================================

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
          "Failed to update task:",
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

  // ==================================================
  // OPEN ADD MODAL
  // ==================================================

  const openAddModal = () => {
    setFormData({
      ...EMPTY_FORM,
    });

    setAddError("");

    setShowAddTask(true);
  };

  // ==================================================
  // CLOSE ADD MODAL
  // ==================================================

  const closeAddModal = () => {
    if (isSubmitting) {
      return;
    }

    setShowAddTask(false);

    setFormData({
      ...EMPTY_FORM,
    });

    setAddError("");
  };

  // ==================================================
  // CREATE TASK
  // ==================================================

  const handleAddTask = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setAddError(
        "Task title is required.",
      );
      return;
    }

    if (!formData.description.trim()) {
      setAddError(
        "Task description is required.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setAddError("");

      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title:
              formData.title.trim(),
            description:
              formData.description.trim(),
            status: formData.status,
            priority: formData.priority,
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

      setFormData({
        ...EMPTY_FORM,
      });

      setAddError("");

      setShowAddTask(false);
    } catch (error) {
      console.error(
        "Failed to create task:",
        error,
      );

      setAddError(
        "Failed to create task. Please check that the backend is running.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================================================
  // OPEN EDIT MODAL
  // ==================================================

  const openEditModal = (
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

    setEditingTaskId(taskId);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });

    setEditError("");

    setShowEditTask(true);
  };

  // ==================================================
  // CLOSE EDIT MODAL
  // ==================================================

  const closeEditModal = () => {
    if (isUpdating) {
      return;
    }

    setShowEditTask(false);

    setEditingTaskId(null);

    setFormData({
      ...EMPTY_FORM,
    });

    setEditError("");
  };

  // ==================================================
  // UPDATE TASK
  // ==================================================

  const handleUpdateTask =
    async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        editingTaskId === null ||
        editingTaskId === undefined
      ) {
        setEditError(
          "Task ID is missing.",
        );
        return;
      }

      if (!formData.title.trim()) {
        setEditError(
          "Task title is required.",
        );
        return;
      }

      if (
        !formData.description.trim()
      ) {
        setEditError(
          "Task description is required.",
        );
        return;
      }

      try {
        setIsUpdating(true);
        setEditError("");

        const response = await fetch(
          `${API_URL}/tasks/${editingTaskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title:
                formData.title.trim(),
              description:
                formData.description.trim(),
              status:
                formData.status,
              priority:
                formData.priority,
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
                ) ===
                  String(
                    editingTaskId,
                  )
                  ? formattedTask
                  : currentTask;
              },
            ),
        );

        setShowEditTask(false);

        setEditingTaskId(null);

        setFormData({
          ...EMPTY_FORM,
        });

        setEditError("");
      } catch (error) {
        console.error(
          "Failed to update task:",
          error,
        );

        setEditError(
          "Failed to update task. Please try again.",
        );
      } finally {
        setIsUpdating(false);
      }
    };

  // ==================================================
  // DELETE TASK
  // ==================================================

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
          "Delete task error:",
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
                ) !== String(taskId)
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
    }
  };

  // ==================================================
  // STATISTICS
  // ==================================================

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

  // ==================================================
  // UI
  // ==================================================

  return (
    <main
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="flex min-h-screen">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <Sidebar
          darkMode={darkMode}
          activePage="tasks"
        />

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <section className="min-w-0 flex-1">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header
            className={`flex h-16 items-center justify-between border-b px-4 md:px-8 ${
              darkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <div>
              <h2 className="text-lg font-semibold">
                Tasks
              </h2>

              <p className="text-xs text-slate-500">
                Manage your tasks
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* DARK MODE */}

              <button
                type="button"
                onClick={
                  toggleDarkMode
                }
                aria-label={
                  darkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-slate-200 hover:bg-slate-100"
                }`}
              >
                {darkMode
                  ? "☀️ Light"
                  : "🌙 Dark"}
              </button>

              {/* USER */}

              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"
                aria-label="User profile"
              >
                T
              </div>

            </div>
          </header>

          {/* ==================================================
              PAGE CONTENT
          ================================================== */}

          <div className="p-4 md:p-8">

            {/* TOP SECTION */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-3xl font-bold">
                  All Tasks
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage all tasks from MongoDB.
                </p>
              </div>

              <a
                href="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Dashboard
              </a>

            </div>

            {/* ==================================================
                STATISTICS
            ================================================== */}

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

            {/* ==================================================
                TASK LIST
            ================================================== */}

            <div
              className={`overflow-hidden rounded-xl border shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >

              {/* TASK HEADER */}

              <div
                className={`flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between ${
                  darkMode
                    ? "border-slate-800"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <h3 className="font-semibold">
                    Task List
                  </h3>

                  <p className="text-sm text-slate-500">
                    {totalTasks}{" "}
                    {totalTasks === 1
                      ? "task"
                      : "tasks"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    openAddModal
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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
                        onClick={
                          loadTasks
                        }
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
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

                          <div className="flex min-w-0 items-start gap-3">

                            {/* CHECKBOX */}

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
                              aria-label={`Mark ${task.title} as ${
                                task.status ===
                                "Done"
                                  ? "todo"
                                  : "done"
                              }`}
                              className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                            />

                            {/* TASK DETAILS */}

                            <div className="min-w-0">

                              <h4
                                className={`font-medium break-words ${
                                  task.status ===
                                  "Done"
                                    ? "text-slate-400 line-through"
                                    : ""
                                }`}
                              >
                                {
                                  task.title
                                }
                              </h4>

                              <p className="mt-1 break-words text-sm text-slate-500">
                                {
                                  task.description
                                }
                              </p>

                            </div>

                          </div>

                          {/* RIGHT */}

                          <div className="flex shrink-0 flex-wrap items-center gap-2">

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
                              onClick={() =>
                                openEditModal(
                                  task,
                                )
                              }
                              className="rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition hover:bg-yellow-200"
                            >
                              Edit
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteTask(
                                  task,
                                )
                              }
                              className="rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200"
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

      {/* ==================================================
          ADD TASK MODAL
      ================================================== */}

      {showAddTask && (
        <TaskModal
          mode="add"
          darkMode={darkMode}
          formData={formData}
          error={addError}
          isSubmitting={
            isSubmitting
          }
          onChange={
            handleFormChange
          }
          onSubmit={
            handleAddTask
          }
          onClose={
            closeAddModal
          }
        />
      )}

      {/* ==================================================
          EDIT TASK MODAL
      ================================================== */}

      {showEditTask && (
        <TaskModal
          mode="edit"
          darkMode={darkMode}
          formData={formData}
          error={editError}
          isSubmitting={
            isUpdating
          }
          onChange={
            handleFormChange
          }
          onSubmit={
            handleUpdateTask
          }
          onClose={
            closeEditModal
          }
        />
      )}
    </main>
  );
}