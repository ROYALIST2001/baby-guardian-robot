# Baby Guardian Robot

An AI baby monitor that watches, thinks, and acts.

It listens for crying, checks the baby is visible, and reads facial expressions
for distress. A reasoning loop decides what to do, sends commands to the robot,
and learns which lullaby actually settles that particular baby. Real emergencies
like smoke or fire bypass the AI entirely and run on fixed rules.

Built software-first on simulated data, so every part of the reasoning could be
tested before any hardware existed.

## Stack

| Piece | What it is |
| --- | --- |
| `node-backend` | Express API, MQTT listener, Socket.IO, BullMQ alert queue |
| `python-backend` | FastAPI, the AI senses and the LangGraph brain |
| `mobile-app` | React Native (Expo) app for the parent |
| `simulator` | A fake robot that publishes sensor data |
| `nginx` | Single front door in front of both backends |

Supabase for the database and auth, Redis for caching and the queue,
HiveMQ for MQTT. AI models run in Google Colab, reached over ngrok.

## Running it

```bash
docker compose up --build
```

Then open http://localhost/api/status for the system status dashboard.

The app runs separately:

```bash
cd mobile-app
npx expo start
```

## Configuration

Copy your secrets into a `.env` file at the project root. It is gitignored.
Twilio and Sentry keys are optional — leave them out and the system logs
instead of sending, and keeps working.

## Tests

```bash
docker compose run --rm node-backend npm test
```
