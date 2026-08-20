"use client";

import { useRouter } from "next/navigation";

type SidebarProps = {
  darkMode: boolean;
  activePage: "dashboard" | "tasks";
};

export default function Sidebar({
  darkMode,
  activePage,
}: SidebarProps) {
  const router = useRouter();

  const baseClass =
    "w-full rounded-lg px-4 py-3 text-left text-sm transition";

  const inactiveClass = darkMode
    ? "text-slate-200 hover:bg-slate-800"
    : "text-slate-700 hover:bg-slate-100";

  const activeClass =
    "bg-blue-600 font-medium text-white";

  return (
    <aside
      className={`hidden w-64 border-r md:block ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* LOGO */}
      <div
        className={`flex h-16 items-center border-b px-6 ${
          darkMode
            ? "border-slate-800"
            : "border-slate-200"
        }`}
      >
        <h1 className="text-xl font-bold">
          AbleSpace
        </h1>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-2 p-4">

        {/* DASHBOARD */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className={`${baseClass} ${
            activePage === "dashboard"
              ? activeClass
              : inactiveClass
          }`}
        >
          Dashboard
        </button>

        {/* TASKS */}
        <button
          type="button"
          onClick={() => router.push("/tasks")}
          className={`${baseClass} ${
            activePage === "tasks"
              ? activeClass
              : inactiveClass
          }`}
        >
          Tasks
        </button>

        {/* PROJECTS */}
        <button
          type="button"
          className={`${baseClass} ${inactiveClass}`}
        >
          Projects
        </button>

        {/* SETTINGS */}
        <button
          type="button"
          className={`${baseClass} ${inactiveClass}`}
        >
          Settings
        </button>

      </nav>
    </aside>
  );
}