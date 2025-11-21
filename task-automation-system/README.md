# Task Automation System

Automate intern task assignment and reminders.

## Overview
- Backend (Node/Express): REST API, cron jobs for task creation and reminder checks, SSE for real-time reminders.
- Frontend (React + Vite): Task list UI, add task form, automatic reminders via browser notifications (SSE).

## Quick Start

### 1) Backend
```
cd backend
npm install
npm run dev
```
- Runs on http://localhost:4000

### 2) Frontend
```
cd frontend
npm install
npm run dev
```
- Opens on http://localhost:5173 (proxied to backend `/api` and `/api/events`).

## Notes
- Reminders: A cron job runs every minute to find tasks that are due within the minute and broadcasts via SSE to connected clients. Browser notifications appear if permission is granted.
- Auto-creation: A daily job at 09:00 (Mon–Fri) creates a sample task for interns.
