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

## ✅ Phase 3 — Node.js Backend Server (done)

- [x] Professional src/ structure (routes, middleware, services, queues)
- [x] Versioned REST APIs (/api/v1) with full CRUD
- [x] Login endpoint + JWT auth guard (every route protected)
- [x] Per-user data filtering (parents only see their own data)
- [x] Rate limiting (general + strict login) and Helmet + CORS
- [x] MQTT over TLS to HiveMQ Cloud (sensors + events topics)
- [x] Sensor simulator (fake robot) as its own container
- [x] Socket.IO live updates + browser test page + Nginx websocket config
- [x] BullMQ alert queue on Redis (retries, backoff, priority)
- [x] Mode controller (manual/auto in Redis, announces via Socket.IO + MQTT)
- [x] Alert manager rules (info/warning/emergency, auto-switch to manual)
- [x] First Jest automated tests (4 passing)

## Phase 4 - AI Senses (done)

- [x] Layered FastAPI structure for the Python backend
- [x] Cry detection from audio (via Colab model server)
- [x] Baby detection from image (via Colab model server)
- [x] Redis caching: exact-match and time-window
- [x] Pytest tests for cache keys and crying logic
- [ ] Fine-tuning the cry model (optional, later improvement)

## Notes

- AI models run in Google Colab for now (testing only), reached by ngrok URL.
- Colab URL changes each session. Update COLAB_AI_URL in .env each time.

## Phase 5 - AI Brain (done)

- [x] Single decide step: rules for danger, GPT for soft choices
- [x] Full LangGraph loop: Perceive, Analyze, Decide, Act, Learn
- [x] Brain runs automatically on robot events (Node calls Python)
- [x] Memory: read and write baby_patterns (last_action, cry_count)
- [ ] Advanced brain features (branches, deeper memory) - optional later

## Notes

- Uses OpenAI model gpt-4.1-nano (cheap). Model name is in .env as OPENAI_MODEL.
- Emergencies use fixed rules, not GPT, for safety and low cost.

## Phase 6 - Mobile App (done)

- [x] React Native app with Expo, layered structure
- [x] Signup, login, and secure token storage
- [x] Live sensor dashboard with Socket.IO updates
- [x] Robot control: mode switch, joystick, music
- [x] Emergency auto-switch to manual mode
- [x] Live video screen with camera controls
- [x] Emergency screen with resolve

## Notes

- The app IP is set in mobile-app/src/config/api.js. Update it if your WiFi IP changes.
- CAMERA_URL is empty until the robot camera exists.
- Socket messages go to all clients. Per-parent rooms are a known future improvement.
- The biometric code is complete and correct.
- Face ID does not run inside Expo Go on iPhone.
- Test it later with a real build, near the end of the project.
- No code changes should be needed. Only the build.
