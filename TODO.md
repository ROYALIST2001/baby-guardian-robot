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

## Phase 2 — Database (done)

- [x] Supabase project created
- [x] Designed 5 tables (profiles, babies, sensor_readings, events, baby_patterns)
- [x] Enabled Row Level Security + policies (each parent sees only their data)
- [x] Created a test user (Auth)
- [x] Seeded sample data
- [x] Created private Storage bucket (baby-media)
- [x] Enabled Realtime on sensor_readings and events
- [x] Connected Node.js and Python backends to Supabase (secret key in .env)
- [x] Manual backup method noted (CSV export / pg_dump)

## ▶️ Next up

- [ ] Phase 3 — Node.js backend server (REST APIs, MQTT, realtime, alert queues)
