# PMS Frontend

This directory contains the **Frontend application** for the PMS (Project Management System).

The frontend is built using **React + TypeScript + Vite** and provides the user interface for dashboards, project tracking, task management, and backend interaction.

---

## 🚀 Tech Stack

- React (TypeScript)
- Vite
- Tailwind CSS
- Axios / Fetch API

---

## 📁 Project Structure

FrontEnd/
│── components/
│   ├── CapacityTrends.tsx
│   ├── LeadCard.tsx
│   ├── LeadDetailModal.tsx
│   ├── ProjectsList.tsx
│   ├── Sidebar.tsx
│   ├── SpecialistCard.tsx
│   ├── TaskFormModal.tsx
│   ├── TaskTable.tsx
│   └── TopHeader.tsx
│
│── App.tsx
│── index.tsx
│── index.html
│── constants.tsx
│── types.ts
│── metadata.json
│── vite.config.ts
│── tsconfig.json
│── package.json
│── package-lock.json
│── README.md   ✅
│── .gitignore  ✅


---

## 🛠️ Getting Started

### 1️⃣ Install dependencies
npm install

### 2️⃣ Start development server
npm run dev

The application will be available at:
http://localhost:5173

---

## 🔗 Backend API Integration

- The frontend communicates with the PMS backend via REST APIs.
- API base URLs should be configured using environment variables.

Example:
VITE_API_BASE_URL=http://localhost:8000

⚠️ Do NOT commit .env or .env.local files.

---

## 📦 Build for Production

npm run build

The production-ready files will be generated inside the dist/ directory.

---

## 👥 Team Guidelines

- Do not commit node_modules
- Always pull the latest changes before pushing
- Keep components modular and reusable
- Follow consistent naming conventions

---

## 📌 Notes

This frontend is designed to integrate seamlessly with the PMS backend services and may evolve as backend APIs expand.
