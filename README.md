# Fullstack Social Post Composer

Production-ready JavaScript full-stack module for creating social posts with real-time platform-aware validation.

## Stack
- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas

## Features
- Multi-platform post composer with polished responsive UI
- Platform selection (multi-select)
- Local media mock attachments (image/video metadata)
- Real-time per-platform validation feedback
- Backend source-of-truth validation on submit
- Persist valid posts to MongoDB
- View recent created posts

## Platform rules
- **x**: 280 chars, hashtags allowed, max 4 images or 1 video
- **instagram**: 2200 chars, media required, max 10 media
- **linkedin**: 3000 chars, media optional, max 9 images

## Project structure
- `/client` – frontend app
- `/server` – API and MongoDB persistence

## Setup
### 1) Install dependencies
```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2) Configure environment variables
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` with your MongoDB Atlas URI.

### 3) Run in development
```bash
npm run dev
```
- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

## Available scripts
From repository root:
- `npm run dev` – run client and server together
- `npm run dev:client` – run frontend only
- `npm run dev:server` – run backend only
- `npm run lint` – run client lint
- `npm run build` – build client for production
- `npm run test` – run server tests

## API
- `GET /api/platforms` – fetch platform constraints
- `POST /api/posts` – validate and create a post
- `GET /api/posts` – list posts (latest first)

### Example create payload
```json
{
  "content": "Launching our new feature! #buildinpublic",
  "platforms": ["x", "linkedin"],
  "media": [
    { "type": "image", "name": "hero.png", "size": 142300 }
  ]
}
```
