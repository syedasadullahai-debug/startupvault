# StartupVault

> Discover Ideas. Build Teams. Create Startups.

A full-stack startup collaboration platform built with React 19 + Spring Boot 3 + MySQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Java 21, Spring Boot 3.3, Spring Security, JWT |
| Database | MySQL 8 |
| Deployment | Frontend → Vercel, Backend → Render, DB → MySQL Cloud |

## Local Development

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8

### Backend Setup

1. Create MySQL database:
```sql
CREATE DATABASE startupvault;
```

2. Copy `.env.example` to `.env` and fill in your values.

3. Run the backend:
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET  /api/auth/me` — Current user

### Profile
- `GET  /api/profile` — Get profile
- `PUT  /api/profile` — Update profile

### Startups
- `GET  /api/startups` — List (search, category, sort, page)
- `GET  /api/startups/:id` — Detail
- `POST /api/startups` — Create
- `PUT  /api/startups/:id` — Update (founder only)
- `DELETE /api/startups/:id` — Delete (founder/admin)
- `GET  /api/startups/my` — My founded + joined

### Applications
- `POST /api/applications/startups/:id` — Apply
- `GET  /api/applications/received` — Received (as founder)
- `GET  /api/applications/sent` — Sent (as applicant)
- `POST /api/applications/:id/accept` — Accept
- `POST /api/applications/:id/reject` — Reject

### Notifications
- `GET  /api/notifications` — All notifications
- `GET  /api/notifications/unread-count` — Unread count
- `POST /api/notifications/read-all` — Mark all read
- `POST /api/notifications/:id/read` — Mark one read

### Likes & Bookmarks
- `POST   /api/likes/startups/:id` — Like
- `DELETE /api/likes/startups/:id` — Unlike
- `POST   /api/bookmarks/startups/:id` — Bookmark
- `DELETE /api/bookmarks/startups/:id` — Unbookmark

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```
Set `VITE_API_URL` to your Render backend URL.

### Backend (Render)
- Build command: `./mvnw package -DskipTests`
- Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
- Set all env vars from `.env.example` in Render dashboard.

## Business Rules
- A user can join a maximum of **2** startups (created startups don't count)
- A founder cannot apply to their own startup
- A user cannot apply twice to the same startup
- All data is stored in the database — no business data in localStorage
