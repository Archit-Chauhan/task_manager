# Task Manager – WorkSync Pro

WorkSync Pro is a full-stack task and workforce management web application.
It helps organizations manage employees, shifts, tasks, and approvals using
a secure, role-based system.

---

## 🚀 Features

- JWT-based authentication
- Role-based access (Admin / Manager / Employee)
- Shift scheduling with conflict detection
- Shift swap request & approval workflow
- Task management (TODO / IN_PROGRESS / DONE / BLOCKED)
- Drag & drop task board
- Admin audit logs & dashboards

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 👥 User Roles

- **Admin** – Full system access, audit logs, analytics
- **Manager** – Manage shifts, tasks, approvals
- **Employee** – View shifts, manage tasks, request swaps

---

## ▶️ Run Locally

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
