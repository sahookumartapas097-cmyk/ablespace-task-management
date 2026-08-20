# AbleSpace Task Management System

A full-stack Task Management System built as part of the AbleSpace Full Stack Developer Technical Assessment.

## 🚀 Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Next.js App Router

### Backend
- NestJS
- TypeScript
- REST APIs
- class-validator
- class-transformer

### Database
- MongoDB

## ✨ Features

### Dashboard
- Welcome section
- Task statistics
- Total tasks
- Todo tasks
- In Progress tasks
- Completed tasks
- Navigation to task management

### Task Management
- View all tasks
- Create a new task
- Edit an existing task
- Delete a task
- Mark tasks as completed
- Change task status
- Set task priority
- Task validation
- Loading and error states

### Theme
- Light mode
- Dark mode
- Theme preference persists after page refresh

### UI & Components
- Responsive layout
- Reusable Sidebar component
- Reusable TaskModal component
- Consistent Tailwind CSS styling
- Responsive task list
- Status and priority indicators

## 📁 Project Structure

```text
ablespace-task-management/
│
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── dns-config.ts
│   ├── test/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── package.json
│
└── README.md