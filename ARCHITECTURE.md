# System Architecture - Forge 2 Edition 2

This document details the multi-agent orchestrator architecture, Slack communication routing, model provider fallbacks, and task execution pipeline built for the Forge 2 Qualifier.

---

## 1. Agent Roles & Decomposition

```
                    +-----------------------------+
                    |  Human (Product Owner / UI) |
                    +--------------+--------------+
                                   |
                                   v  #sprint-main
                    +-----------------------------+
                    |   HERMES AGENT (The Brain)  |
                    |  - High-level planning      |
                    |  - Persistent memory        |
                    |  - Skill execution          |
                    |  - Autonomous cron updates  |
                    +--------------+--------------+
                                   |
                                   v  #agent-coder
                    +-----------------------------+
                    |   OPENCLAW (The Hands)      |
                    |  - Scaffolding & Code gen   |
                    |  - Execution & verification |
                    |  - Automated status updates |
                    +--------------+--------------+
                                   |
                                   v  #agent-log
                    +-----------------------------+
                    |     Audit Log Channel       |
                    |  - Full execution traces    |
                    |  - Autonomous cron logs     |
                    +-----------------------------+
```

### Hermes (The Brain / Orchestrator)
- **Primary Function**: Task decomposition, architectural decision-making, human alignment, persistent cross-session memory, and skill execution.
- **Persistent Memory**: Stores repository state, default branch (`main`), API contracts, and user preferences across multiple sessions.
- **Skill Execution**: Runs `skills/status-report/SKILL.md` for structured progress reporting.
- **Autonomous Cron**: Periodically posts status summaries to `#sprint-main` without direct human prompts.

### OpenClaw (The Hands / Coder)
- **Primary Function**: Code generation, file manipulation, migration execution, and verification.
- **Input Source**: Listens to task assignments routed into `#agent-coder` by Hermes.
- **Output Target**: Reports code changes, test results, and file status back into `#agent-coder` and `#agent-log`.

---

## 2. Slack Channel Scheme

| Channel Name | Purpose | Authorized Sender(s) |
| :--- | :--- | :--- |
| `#sprint-main` | High-level goals, human prompts, Hermes plans, and section updates (`What I Did / What's Left / What Needs Your Call`). | Human, Hermes |
| `#agent-coder` | Hermes delegates granular coding tasks to OpenClaw; OpenClaw returns code diffs and execution reports. | Hermes, OpenClaw |
| `#agent-log` | Unedited execution audit trail, cron triggers, and raw system outputs. | Hermes, OpenClaw |

---

## 3. Model Routing & Fallback Ladder

To ensure zero-cost operation and maximum uptime, we utilize a tiered model routing scheme based on agent capability requirements.

| Agent | Primary Model | Provider | Base URL | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Hermes (Brain)** | `openai/gpt-oss-120b` | Groq | `https://api.groq.com/openai/v1` | Fast inference, high reasoning capacity for decomposition. |
| **Hermes (Fallback)** | `gemini-2.5-flash` | Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai/` | Massive context window, 100% free tier uptime. |
| **OpenClaw (Hands)** | `qwen2.5-coder` | Ollama (Local) | `http://localhost:11434/v1` | Dedicated code synthesis, unlimited local throughput. |
| **OpenClaw (Fallback)**| `llama-3.3-70b-versatile` | Groq | `https://api.groq.com/openai/v1` | High-speed structured code output fallback on rate limits. |

### Fallback Ladder Flow:
1. `Groq (openai/gpt-oss-120b)` → Main orchestrator engine.
2. If Groq rate-limited (HTTP 429) → Switch to `Gemini 2.5 Flash`.
3. If internet disconnected or cloud unavailable → Fallback to `Ollama (qwen2.5-coder)` locally.

---

## 4. Reusable Skill Specification

Hermes uses `skills/status-report/SKILL.md` to format all status updates sent to `#sprint-main`.

```yaml
---
name: status-report
description: Post a What I Did / What's Left / What Needs Your Call update to Slack.
---
```

When invoked manually or via background cron, it formats output into:
- `**What I Did**`: Completed features and verified milestones.
- `**What's Left**`: Pending technical requirements.
- `**What Needs Your Call**`: Unresolved design choices or human approvals required.

---

## 5. Runtime Audit Log Files

To satisfy NMG Labs evaluation rules (proving LLM calls and multi-agent execution ran genuine tasks without "agent-theatre"), raw execution dumps are stored at:
- **Hermes Runtime Log**: [`logs/hermes_runtime.log`](logs/hermes_runtime.log) (HTTP status, prompt/completion token counts, latencies, tool calls, and Groq headers).
- **OpenClaw Runtime Log**: [`logs/openclaw_runtime.log`](logs/openclaw_runtime.log) (Ollama model requests, file writes, migration execution, and test builds).
- **Slack Socket Payloads**: [`slack-export/raw_agent_transcripts.json`](slack-export/raw_agent_transcripts.json) (Raw Socket Mode WSS event payloads).

