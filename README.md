# MiniTasks

MiniTasks is a simple full-stack todo app for testing local and cloud deployment workflows.

## Project Structure

```text
MiniTasks/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── db.js
│       └── server.js
├── database/
│   ├── .gitkeep
│   ├── init-db.js
│   └── schema.sql
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install all dependencies:
  ```bash
   npm install
   npm run install:all
  ```
2. Create environment files:
  ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
  ```
3. Initialize database:
  ```bash
   npm run db:init
  ```

## Run Locally

Start frontend and backend together:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000` (or `PORT` from `backend/.env`)

## Environment Variables

### Backend (`backend/.env`)

- `PORT`: server port (default: `4000`)
- `DB_FILE`: SQLite file path (default: `../../database/minitasks.sqlite`)

### Frontend (`frontend/.env`)

- `VITE_API_URL`: backend base URL (default: `http://localhost:4000`)

## API Endpoints

- `GET /tasks` - list tasks
- `POST /tasks` - create task with JSON body `{ "title": "..." }`
- `PUT /tasks/:id` - mark task complete

