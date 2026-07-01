# Project Status & TODO

This file tracks what is finished and what is paused.

## Phase 1 — Infrastructure (mostly done)

- [x] Docker + Docker Compose set up
- [x] Node.js backend (receptionist) — runs locally
- [x] Python FastAPI backend (AI scientist) — runs locally
- [x] Redis helper service — runs locally
- [x] Nginx reverse proxy (single front door) — runs locally
- [x] Environment variables in .env (kept private via .gitignore)
- [x] Git version control + uploaded to GitHub
- [x] GitHub Actions CI (automatic build check on every push)

## Phase 1 — PAUSED (come back later)

- [ ] Deploy Node.js backend to Railway
- [ ] Deploy Python backend to Render
- [ ] Confirm auto-deploy pipeline (push to GitHub -> live update)
   > Note: Deployment intentionally postponed. Everything is being
   > built and tested locally with `docker compose up` for now.
   > Cloud hosting will be added when the project is closer to done.

## Phase 2

- [ ] Phase 2 — Supabase database (the system's memory)
