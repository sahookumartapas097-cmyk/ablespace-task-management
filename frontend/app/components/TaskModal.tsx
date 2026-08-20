"use client";

import { FormEvent } from "react";

export type TaskFormData = {
  title: string;
  description: string;
  status: string;
  priority: string;
};

type TaskModalProps = {
  mode: "add" | "edit";
  darkMode: boolean;

  formData: TaskFormData;

  error: string;

  isSubmitting: boolean;

  onChange: (
    field: keyof TaskFormData,
    value: string,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;

  onClose: () => void;
};

export default function TaskModal({
  mode,
  darkMode,
  formData,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  onClose,
}: TaskModalProps) {
  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
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
              {isEdit ? "Edit Task" : "Add New Task"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Update your task details."
                : "Create a new task for your workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {/* TITLE */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(event) =>
                onChange(
                  "title",
                  event.target.value,
                )
              }
              placeholder="Enter task title"
              disabled={isSubmitting}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={(event) =>
                onChange(
                  "description",
                  event.target.value,
                )
              }
              placeholder="Enter task description"
              rows={4}
              disabled={isSubmitting}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(event) =>
                onChange(
                  "status",
                  event.target.value,
                )
              }
              disabled={isSubmitting}
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
              value={formData.priority}
              onChange={(event) =>
                onChange(
                  "priority",
                  event.target.value,
                )
              }
              disabled={isSubmitting}
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
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}