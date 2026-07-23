# Forge 2 Qualifier - Two-Agent System & Tiny Kanban Board

> **Submission for Forge 2 Edition 2 Qualifier (Saturday 25 July 2026)**  
> **Repository Owner:** Niraj Mahto (`nirajmahto1`)  
> **Contact Email:** `itsnirajmahto@gmail.com`  
> **GitHub Repository:** [https://github.com/nirajmahto1/forge2-qualifier](https://github.com/nirajmahto1/forge2-qualifier)  
> **Live Deployed URL:** [https://forge2-qualifier-odez0rir0-nirajmahto1s-projects.vercel.app](https://forge2-qualifier-odez0rir0-nirajmahto1s-projects.vercel.app)  

---

## 🌐 Live URL & Screen Recording Evidence

* **Live Frontend URL**: [https://forge2-qualifier-odez0rir0-nirajmahto1s-projects.vercel.app](https://forge2-qualifier-odez0rir0-nirajmahto1s-projects.vercel.app)  
  *(Deploys the React Kanban application in live interactive mode with full board, list, card, tag, member, overdue badge, and comment support)*
* **Live Backend API URL (Render)**: [https://forge-kanban-api-mq9r.onrender.com/api](https://forge-kanban-api-mq9r.onrender.com/api)  
  *(Live Laravel 13 REST API backend running on Docker/SQLite)*

---

## 🚀 Overview

This repository contains the complete submission for the **Forge 2 Edition 2 Qualifier**. It demonstrates a working two-agent system orchestrated via Slack, featuring:
1. **Hermes (The Brain)**: High-level planning, skill execution (`status-report`), persistent cross-session memory, and autonomous cron reporting.
2. **OpenClaw (The Hands)**: Code generation, execution, scaffold creation, and task completion reporting.
3. **Full-Stack Tiny Kanban App**: A Trello-style board application with Laravel API (SQLite) backend and React (Vite) frontend.

---

## 🛠️ Tech Stack & Model Routing

### Tech Stack (100% Free Tier)
- **Backend API**: Laravel 13 (PHP 8.4+), SQLite Database.
- **Frontend UI**: React 18, Vite, Lucide Icons, CSS3.
- **Communication Hub**: Slack (Socket Mode Integration).
- **Version Control**: Git + GitHub (`nirajmahto1/forge2-qualifier`).
- **Live Hosting**: Vercel.

### Model Routing Rationale

| Agent | Primary Model | Provider | Base URL | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Brain (Hermes)** | `openai/gpt-oss-120b` | Groq | `https://api.groq.com/openai/v1` | High reasoning capacity for task decomposition & memory. |
| **Brain (Fallback)** | `gemini-2.5-flash` | Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` | Reliable high-uptime backup model with large context length. |
| **Hands (OpenClaw)**| `qwen2.5-coder` | Ollama (Local) | `http://localhost:11434/v1` | Specialized coding LLM running locally with zero latency or rate limits. |
| **Hands (Fallback)** | `llama-3.3-70b` | Groq | `https://api.groq.com/openai/v1` | High-speed cloud fallback for rapid multi-file edits. |

---

## 📋 Required Features Checklist

- [x] **Boards -> Lists -> Cards**: Create boards, manage lists (To-Do, Doing, Done), and move cards across lists.
- [x] **Card Details**: Title + Description editing in interactive modal.
- [x] **Tags / Labels**: Add and manage custom colored tags (e.g. `Bug` 🔴, `Design` 🔵, `Feature` 🟢, `DevOps` 🟣).
- [x] **Member Assignment**: Add members to boards and assign them to specific cards with avatars.
- [x] **Due Date & Overdue Flagging**: Set due dates with visual overdue highlight badges (`⚠️ OVERDUE`).
- [x] **Bonus Features**: List transfer dropdowns, Card Comments feed.

---

## 💻 Local Run Steps for the API & Frontend

### Prerequisites
- Node.js 22.19+ (v24.18.0 tested)
- PHP 8.2+ (PHP 8.4.12 tested)
- Composer 2.9+
- SQLite3

### Step 1: Start the Backend API (Laravel + SQLite)
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if cloning fresh)
composer install --no-dev

# Set up environment file and application key
cp .env.example .env
php artisan key:generate

# Initialize SQLite database and seed demo data
touch database/database.sqlite
php artisan migrate:fresh --seed

# Start the Laravel REST API server
php artisan serve --port=8000
```
*Backend API will run live at `http://localhost:8000/api`*

### Step 2: Start the Frontend UI (React + Vite)
```bash
# Open a second terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the React Vite development server
npm run dev
```
*Frontend UI will run live at `http://localhost:5173`*

---

## 📂 Repository Contents

```
├── .env.example                # Sanitized environment template
├── ARCHITECTURE.md             # System architecture & model routing
├── README.md                   # Setup instructions & project overview
├── agent-log.md                # Audit transcript mapped to git commits
├── openclaw.example.json       # Sanitized OpenClaw config patch
├── render.yaml                 # 1-click Render/Railway backend deployment
├── logs/
│   ├── hermes_runtime.log      # Raw Hermes LLM execution traces & token usage
│   └── openclaw_runtime.log    # Raw OpenClaw code synthesis runtime log
├── skills/
│   └── status-report/
│       └── SKILL.md            # Hermes reusable status reporting skill
├── slack-export/
│   ├── raw_agent_transcripts.json  # Raw Slack Socket Mode event payloads
│   ├── roundtrip_test.json     # Slack API round-trip test outputs
│   └── cron_proof.md           # Proof of autonomous cron execution
├── evidence/
│   ├── walkthrough.md          # Visual feature verification & screenshots
│   └── walkthrough.mp4         # Screen-recording video committed to repo
├── backend/                    # Laravel 13 API (SQLite)
└── frontend/                   # React + Vite Kanban UI
```
