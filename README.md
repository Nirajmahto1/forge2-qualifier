# Forge 2 Qualifier - Two-Agent System & Tiny Kanban Board

> **Submission for Forge 2 Edition 2 Qualifier (Saturday 18 July 2026)**  
> **Repository Owner:** Niraj Mahto (`nirajmahto1`)  
> **Contact Email:** `itsnirajmahto@gmail.com`  

---

## 🚀 Overview

This repository contains the complete submission for the **Forge 2 Edition 2 Qualifier**. It demonstrates a working two-agent system orchestrated via Slack, featuring:
1. **Hermes (The Brain)**: High-level planning, skill execution (`status-report`), persistent cross-session memory, and autonomous cron reporting.
2. **OpenClaw (The Hands)**: Code generation, execution, scaffold creation, and task completion reporting.
3. **Full-Stack Tiny Kanban App**: A Trello-style board application with Laravel API (SQLite) backend and React (Vite) frontend.

---

## 🛠️ Tech Stack & Model Routing

### Tech Stack (100% Free Tier)
- **Backend API**: Laravel 11/12 (PHP 8.4+), SQLite Database.
- **Frontend UI**: React 18, Vite, Lucide Icons, CSS3.
- **Communication Hub**: Slack (Socket Mode Integration).
- **Version Control**: Git + GitHub (`nirajmahto1/forge2-qualifier`).

### Model Routing Rationale

| Agent | Primary Model | Provider | Rationale |
| :--- | :--- | :--- | :--- |
| **Brain (Hermes)** | `openai/gpt-oss-120b` | Groq | High reasoning capabilities for planning, breaking down goals, and managing memory. |
| **Brain (Fallback)** | `gemini-2.5-flash` | Google Gemini | Highly reliable backup model with large context length if Groq hits RPM limit. |
| **Hands (OpenClaw)**| `qwen2.5-coder` | Ollama | Specialized coding LLM running locally with zero latency or rate limits. |
| **Hands (Fallback)** | `llama-3.3-70b` | Groq | High-throughput cloud fallback for rapid multi-file edits. |

---

## 📋 Required Features Checklist

- [x] **Boards -> Lists -> Cards**: Create boards, manage lists (To-Do, Doing, Done), and move cards across lists.
- [x] **Card Details**: Title + Description editing in interactive modal.
- [x] **Tags / Labels**: Add and manage custom colored tags (e.g. `Bug` 🔴, `Design` 🔵, `Feature` 🟢).
- [x] **Member Assignment**: Add members to boards and assign them to specific cards with avatars.
- [x] **Due Date & Overdue Flagging**: Set due dates with visual overdue highlight badges.
- [x] **Bonus Features**: Drag & Drop reordering between lists, Card Comments feed.

---

## 💻 Local Quickstart Guide

### Prerequisites
- Node.js 22.19+ (v24.18.0 tested)
- PHP 8.2+ (PHP 8.4.12 tested)
- Composer 2.9+
- SQLite3

### 1. Setup Backend (Laravel API)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate:fresh --seed
php artisan serve --port=8000
```
*Backend API will be live at `http://localhost:8000/api`*

### 2. Setup Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend UI will be running at `http://localhost:5173`*

---

## 📂 Repository Contents

```
├── .env.example                # Sanitized environment template
├── ARCHITECTURE.md             # System architecture & model routing
├── README.md                   # Setup instructions & project overview
├── agent-log.md                # Unedited transcript of agent interaction
├── openclaw.example.json       # Sanitized OpenClaw config patch
├── skills/
│   └── status-report/
│       └── SKILL.md            # Hermes reusable status reporting skill
├── slack-export/
│   ├── roundtrip_test.json     # Slack API round-trip test outputs
│   └── cron_proof.md           # Proof of autonomous cron execution
├── evidence/
│   └── walkthrough.md          # Visual feature verification & screenshots
├── backend/                    # Laravel 11 API (SQLite)
└── frontend/                   # React + Vite Kanban UI
```
