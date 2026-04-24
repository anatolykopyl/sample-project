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

## Deployment (Docker + Ansible)

Infrastructure and deploy steps live in the repo as code:

- `docker-compose.yml` — production stack (backend API + Caddy on ports 80/443).
- `docker/backend/Dockerfile`, `docker/frontend/Dockerfile`, `docker/caddy/Caddyfile` — images and reverse proxy (`/tasks` → API, everything else → SPA). The public hostname is **`https://deploymator.kopyl.dev`** (TLS is issued automatically by Caddy).
- `deploy/ansible/site.yml` — installs Docker on Debian-based hosts, rsyncs the project, runs `docker compose up -d --build`.

**One-time setup on your machine**

1. Install [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/index.html) and [Docker](https://docs.docker.com/get-docker/) (optional locally; required on the server for the app to run).
2. Store the SSH private key only on your machine: `deploy/secrets/deploy_key` with mode `600`. Do not commit keys. Prefer a dedicated deploy key and rotate any key that has been pasted into chat or tickets.
3. From `deploy/ansible`, install the `ansible.posix` collection (needed for `synchronize`):  
   `ansible-galaxy collection install -r requirements.yml`

**Deploy or update**

```bash
cd deploy/ansible
ansible-playbook site.yml
```

Run this whenever application or Docker config changes; Ansible copies the tree and rebuilds containers.

**Inventory**

Edit `deploy/ansible/inventory/production.yml` to change `ansible_host` / `ansible_user`. SSH key path defaults via `deploy/ansible/ansible.cfg` (`private_key_file = ../secrets/deploy_key`). Override with `ansible-playbook site.yml --private-key /path/to/key` if needed.

**Data**

SQLite lives in the named volume `sqlite_data` on the server so task data survives image rebuilds.

**DNS**

Point `deploymator.kopyl.dev` A/AAAA records at the server (currently `81.26.181.94`). Open inbound **80** and **443** on the host firewall and security group so Let’s Encrypt validation and HTTPS work.

